import { BASE_URL } from '../../services/api';

export interface ChatTurn {
  role: 'user' | 'assistant';
  content: string;
}

const GENERIC_ERROR = 'The concierge could not respond just now. Please try again.';

/**
 * Sends the conversation to our API and reports the reply as it streams in.
 * Resolves once the reply is complete; throws with a customer-friendly message.
 */
export async function streamChat(
  messages: ChatTurn[],
  page: string,
  onDelta: (text: string) => void,
  signal: AbortSignal
): Promise<void> {
  let response: Response;
  try {
    response = await fetch(`${BASE_URL}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages, page }),
      signal,
    });
  } catch (error) {
    if (signal.aborted) throw error;
    throw new Error('Cannot reach the concierge. Please check your connection and try again.');
  }

  if (!response.ok || !response.body) {
    const data = await response.json().catch(() => null);
    throw new Error(data?.error || GENERIC_ERROR);
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  for (;;) {
    const { value, done } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const events = buffer.split('\n\n');
    buffer = events.pop() ?? '';

    for (const event of events) {
      if (!event.startsWith('data:')) continue;
      const payload = JSON.parse(event.slice(5)) as { delta?: string; done?: boolean; error?: string };
      if (payload.error) throw new Error(payload.error);
      if (payload.delta) onDelta(payload.delta);
      if (payload.done) return;
    }
  }

  // The connection ended without a completion marker
  throw new Error('The reply was interrupted. Please try again.');
}
