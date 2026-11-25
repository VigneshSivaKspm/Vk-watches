import type { IncomingMessage, ServerResponse } from 'node:http';
import {
  buildCataloguePromptText,
  getCatalogueCollectionBySlug,
  getCatalogueCollections,
  getCatalogueJournal,
  getCatalogueJournalBySlug,
  getCatalogueProductBySlug,
  getCatalogueComparison,
  queryCatalogueProducts,
  scoreWatchFinder,
} from '../src/data/catalogueService';

interface VercelReq extends IncomingMessage {
  query?: Record<string, string | string[] | undefined>;
  body?: unknown;
}

interface VercelRes extends ServerResponse {
  status?: (code: number) => VercelRes;
  json?: (body: unknown) => void;
}

function sendJson(res: VercelRes, statusCode: number, body: unknown) {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(body));
}

async function readBody(req: VercelReq): Promise<Record<string, any>> {
  if (req.body && typeof req.body === 'object') return req.body as Record<string, any>;
  if (typeof req.body === 'string') {
    try {
      return JSON.parse(req.body);
    } catch {
      return {};
    }
  }
  const chunks: Buffer[] = [];
  for await (const chunk of req) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }
  const raw = Buffer.concat(chunks).toString('utf8').trim();
  if (!raw) return {};
  try {
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

async function handleChat(req: VercelReq, res: VercelRes) {
  const apiKey = process.env.GROQ_API_KEY?.trim();
  if (!apiKey) {
    return sendJson(res, 503, { error: 'The AI concierge is not configured yet.' });
  }

  const body = await readBody(req);
  const messages = Array.isArray(body.messages) ? body.messages.slice(-10) : [];
  if (!messages.length) {
    return sendJson(res, 400, { error: 'Please send a message of up to 600 characters.' });
  }

  const system = `You are the VK TIME Concierge, the AI shopping assistant on the VK TIME luxury watch store.
Help only with VK TIME watches, sizing, care, shopping, delivery, returns and warranty. Keep answers warm and under 110 words. Link watches like [VK Sovereign Automatic 40](/watch/vk-sovereign-automatic-40).

CATALOGUE
${buildCataloguePromptText()}`;

  const models = [process.env.GROQ_MODEL?.trim(), 'openai/gpt-oss-120b', 'openai/gpt-oss-20b'].filter(
    (m): m is string => Boolean(m)
  );

  let upstream: Response | null = null;
  for (const model of models) {
    const resp = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model,
        messages: [{ role: 'system', content: system }, ...messages],
        stream: true,
        temperature: 0.3,
        max_completion_tokens: 900,
      }),
    });
    if (resp.ok && resp.body) {
      upstream = resp;
      break;
    }
    if (resp.status === 401 || resp.status === 403) break;
  }

  if (!upstream || !upstream.body) {
    return sendJson(res, 502, { error: 'The concierge could not respond just now. Please try again.' });
  }

  res.writeHead(200, {
    'Content-Type': 'text/event-stream; charset=utf-8',
    'Cache-Control': 'no-cache, no-transform',
    Connection: 'keep-alive',
  });

  const reader = upstream.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  let received = false;

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() ?? '';

    for (const line of lines) {
      const data = line.startsWith('data:') ? line.slice(5).trim() : '';
      if (!data) continue;
      if (data === '[DONE]') {
        res.write(`data: ${JSON.stringify(received ? { done: true } : { error: 'Empty response' })}\n\n`);
        res.end();
        return;
      }
      const chunk = JSON.parse(data);
      const delta: string | undefined = chunk.choices?.[0]?.delta?.content;
      if (delta) {
        received = true;
        res.write(`data: ${JSON.stringify({ delta })}\n\n`);
      }
    }
  }

  res.write(`data: ${JSON.stringify(received ? { done: true } : { error: 'Stream interrupted' })}\n\n`);
  res.end();
}

export default async function handler(req: VercelReq, res: VercelRes) {
  const method = (req.method || 'GET').toUpperCase();
  const parsedUrl = new URL(req.url || '/', 'http://localhost');
  const queryPath = req.query?.__path;
  const rawPath = Array.isArray(queryPath) ? queryPath.join('/') : queryPath;
  const path = '/' + String(rawPath ?? parsedUrl.pathname.replace(/^\/api\/?/, '')).replace(/^\/+/, '');

  const searchParams = new URLSearchParams(parsedUrl.search);
  searchParams.delete('__path');

  // Optional upstream backend proxy when API_UPSTREAM_URL is configured on Vercel
  const upstreamBase = process.env.API_UPSTREAM_URL?.trim().replace(/\/+$/, '');
  if (upstreamBase) {
    try {
      const qs = searchParams.toString();
      const targetUrl = `${upstreamBase}/api${path}${qs ? `?${qs}` : ''}`;
      const bodyObj = method !== 'GET' && method !== 'HEAD' ? await readBody(req) : undefined;
      const upstreamRes = await fetch(targetUrl, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...(req.headers.authorization ? { Authorization: String(req.headers.authorization) } : {}),
        },
        body: bodyObj ? JSON.stringify(bodyObj) : undefined,
      });

      const contentType = upstreamRes.headers.get('content-type') || 'application/json';
      res.statusCode = upstreamRes.status;
      res.setHeader('Content-Type', contentType);
      const text = await upstreamRes.text();
      res.end(text);
      return;
    } catch {
      // Fall through to built-in catalog API for public read routes if upstream is unreachable
    }
  }

  if (path === '/health') {
    return sendJson(res, 200, { brand: 'VK TIME', status: 'Operational', runtime: 'vercel-api' });
  }

  // Products
  if (method === 'GET' && path === '/products') {
    return sendJson(res, 200, queryCatalogueProducts(searchParams));
  }
  if (method === 'GET' && path === '/products/compare') {
    const slugs = searchParams.get('slugs');
    if (!slugs) return sendJson(res, 400, { error: 'Slugs parameter required' });
    return sendJson(res, 200, getCatalogueComparison(slugs));
  }
  if (method === 'POST' && path === '/products/finder') {
    const body = await readBody(req);
    return sendJson(res, 200, scoreWatchFinder(body));
  }
  if (method === 'GET' && path.startsWith('/products/')) {
    const slug = decodeURIComponent(path.slice('/products/'.length));
    const product = getCatalogueProductBySlug(slug);
    if (!product) return sendJson(res, 404, { error: 'Timepiece not found' });
    return sendJson(res, 200, product);
  }

  // Collections
  if (method === 'GET' && path === '/collections') {
    return sendJson(res, 200, getCatalogueCollections());
  }
  if (method === 'GET' && path.startsWith('/collections/')) {
    const slug = decodeURIComponent(path.slice('/collections/'.length));
    const coll = getCatalogueCollectionBySlug(slug);
    if (!coll) return sendJson(res, 404, { error: 'Collection not found' });
    return sendJson(res, 200, coll);
  }

  // Journal
  if (method === 'GET' && path === '/journal') {
    return sendJson(res, 200, getCatalogueJournal());
  }
  if (method === 'GET' && path.startsWith('/journal/')) {
    const slug = decodeURIComponent(path.slice('/journal/'.length));
    const article = getCatalogueJournalBySlug(slug);
    if (!article) return sendJson(res, 404, { error: 'Article not found' });
    return sendJson(res, 200, article);
  }

  // Newsletter & Contact
  if (method === 'POST' && path === '/newsletter/subscribe') {
    const body = await readBody(req);
    if (!body.email || !String(body.email).includes('@')) {
      return sendJson(res, 400, { error: 'Valid email address required' });
    }
    return sendJson(res, 200, {
      message: 'Welcome to the VK TIME Gazette. Your invitation has been confirmed.',
    });
  }
  if (method === 'POST' && path === '/contact') {
    const body = await readBody(req);
    if (!body.name || !body.email || !body.message) {
      return sendJson(res, 400, { error: 'Name, email, and message are required' });
    }
    return sendJson(res, 200, {
      success: true,
      message: 'Your inquiry has been relayed to the VK TIME Horological Concierge.',
    });
  }

  // AI Concierge Chat
  if (method === 'POST' && path === '/chat') {
    return handleChat(req, res);
  }

  return sendJson(res, 503, {
    error: 'This operation requires the stateful API database service (configure API_UPSTREAM_URL or VITE_API_BASE_URL).',
  });
}
