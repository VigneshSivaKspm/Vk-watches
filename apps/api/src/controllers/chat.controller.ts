/**
 * POST /api/chat — streams AI concierge replies from Groq as Server-Sent Events.
 * The API key stays on the server and is never sent to the browser.
 */
import { Request, Response as ExpressResponse } from 'express';
import { z } from 'zod';
import { buildSystemPrompt } from '../services/chat.context';

const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';
const DEFAULT_MODELS = ['openai/gpt-oss-120b', 'openai/gpt-oss-20b'];
const UPSTREAM_TIMEOUT_MS = 30_000;
const HISTORY_LIMIT = 10;

const chatSchema = z.object({
  messages: z
    .array(
      z.discriminatedUnion('role', [
        z.object({ role: z.literal('user'), content: z.string().trim().min(1).max(600) }),
        z.object({ role: z.literal('assistant'), content: z.string().trim().min(1).max(4000) }),
      ])
    )
    .min(1)
    .max(40)
    .refine((list) => list[list.length - 1]?.role === 'user', 'The last message must come from the user'),
  page: z.string().max(200).optional(),
});

/* ---------------------- Per-visitor request limiting ---------------------- */
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 12;
const hits = new Map<string, number[]>();

function isRateLimited(key: string): boolean {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= MAX_PER_WINDOW) {
    hits.set(key, recent);
    return true;
  }
  recent.push(now);
  hits.set(key, recent);
  if (hits.size > 5000) hits.clear();
  return false;
}

const BUSY_MESSAGE = 'The concierge is helping many visitors right now. Please try again in a few seconds.';
const FAILED_MESSAGE = 'The concierge could not respond just now. Please try again.';

/** Tries each configured model in turn until one accepts the request. */
async function openGroqStream(apiKey: string, messages: unknown[], signal: AbortSignal) {
  const preferred = process.env.GROQ_MODEL?.trim();
  const models = preferred ? [preferred, ...DEFAULT_MODELS.filter((m) => m !== preferred)] : DEFAULT_MODELS;
  let lastStatus = 502;

  for (const model of models) {
    const upstream = await fetch(GROQ_URL, {
      method: 'POST',
      signal,
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model,
        messages,
        stream: true,
        temperature: 0.3,
        max_completion_tokens: 900,
        // Reasoning controls are specific to the gpt-oss family
        ...(model.startsWith('openai/gpt-oss') ? { reasoning_effort: 'low', include_reasoning: false } : {}),
      }),
    });

    if (upstream.ok && upstream.body) return { upstream, status: 200 };

    lastStatus = upstream.status;
    const detail = await upstream.text().catch(() => '');
    console.error(`Groq request failed (${model}): ${upstream.status} ${detail.slice(0, 300)}`);
    // A bad key will fail for every model
    if (upstream.status === 401 || upstream.status === 403) break;
  }
  return { upstream: null, status: lastStatus };
}

async function handleChat(req: Request, res: ExpressResponse) {
  const apiKey = process.env.GROQ_API_KEY?.trim();
  if (!apiKey) {
    console.error('GROQ_API_KEY is not set in apps/api/.env');
    return res.status(503).json({ error: 'The AI concierge is not configured yet.' });
  }

  const parsed = chatSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: 'Please send a message of up to 600 characters.' });
  }

  if (isRateLimited(req.ip ?? 'unknown')) {
    return res.status(429).json({ error: 'You are sending messages very quickly. Please wait a minute.' });
  }

  const abort = new AbortController();
  const timeout = setTimeout(() => abort.abort(), UPSTREAM_TIMEOUT_MS);
  // Stop spending tokens if the visitor closes the chat mid-reply
  res.on('close', () => {
    if (!res.writableEnded) abort.abort();
  });

  const send = (payload: Record<string, unknown>) => {
    if (!res.writableEnded && !res.destroyed) res.write(`data: ${JSON.stringify(payload)}\n\n`);
  };

  try {
    const { messages, page } = parsed.data;
    const history = messages.slice(-HISTORY_LIMIT).map(({ role, content }) => ({
      role,
      // Older long replies are trimmed to protect the token budget
      content: content.slice(0, 1500),
    }));
    const system = await buildSystemPrompt(page, history[history.length - 1].content);

    const { upstream, status } = await openGroqStream(
      apiKey,
      [{ role: 'system', content: system }, ...history],
      abort.signal
    );

    if (!upstream) {
      return status === 429
        ? res.status(429).json({ error: BUSY_MESSAGE })
        : res.status(502).json({ error: FAILED_MESSAGE });
    }

    res.writeHead(200, {
      'Content-Type': 'text/event-stream; charset=utf-8',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
      'X-Accel-Buffering': 'no',
    });

    const reader = upstream.body!.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    let received = false;
    let finished = false;

    while (!finished) {
      const { value, done } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() ?? '';

      for (const line of lines) {
        const data = line.startsWith('data:') ? line.slice(5).trim() : '';
        if (!data) continue;
        if (data === '[DONE]') {
          finished = true;
          break;
        }
        const chunk = JSON.parse(data);
        if (chunk.error) throw new Error(chunk.error.message || 'Groq stream error');
        const delta: string | undefined = chunk.choices?.[0]?.delta?.content;
        if (delta) {
          received = true;
          send({ delta });
        }
        if (chunk.choices?.[0]?.finish_reason) finished = true;
      }
    }

    send(received && finished ? { done: true } : { error: FAILED_MESSAGE });
    return res.end();
  } catch (error) {
    if (!res.destroyed) console.error('Chat error:', error instanceof Error ? error.message : error);
    if (!res.headersSent) {
      return res.status(502).json({ error: FAILED_MESSAGE });
    }
    send({ error: FAILED_MESSAGE });
    return res.end();
  } finally {
    clearTimeout(timeout);
  }
}

/**
 * Express 4 does not catch rejected promises, and an unhandled one would stop
 * the whole API, so every failure is contained here.
 */
export const chat = async (req: Request, res: ExpressResponse) => {
  try {
    await handleChat(req, res);
  } catch (error) {
    console.error('Chat error:', error instanceof Error ? error.message : error);
    if (res.headersSent) res.end();
    else res.status(500).json({ error: FAILED_MESSAGE });
  }
};
