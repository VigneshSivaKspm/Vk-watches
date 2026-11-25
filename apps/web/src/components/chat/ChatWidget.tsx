import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { MessageCircle, RotateCcw, Send, Square, X } from 'lucide-react';
import { useCartStore } from '../../stores/useCartStore';
import { watchArt } from '../../lib/images';
import { ChatTurn, streamChat } from './chatClient';
import { MessageBody } from './MessageBody';

interface Message extends ChatTurn {
  id: string;
  error?: string;
}

const STORAGE_KEY = 'vk_time_chat';
const MAX_INPUT = 600;
const SUGGESTIONS = [
  'Suggest a watch under ₹30,000',
  'Which watch suits a slim wrist?',
  "Automatic vs quartz: what's the difference?",
  'What are the warranty and return terms?',
];

const newId = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
const isPhone = () => window.matchMedia('(max-width: 639px)').matches;

const loadMessages = (): Message[] => {
  try {
    const saved = JSON.parse(sessionStorage.getItem(STORAGE_KEY) || '[]');
    if (!Array.isArray(saved)) return [];
    // A reply cut off by a page reload cannot resume
    return saved.filter((m: Message) => m && typeof m.content === 'string' && (m.content || m.error));
  } catch {
    return [];
  }
};

/** Only successful turns are sent back as conversation history. */
const toHistory = (list: Message[]): ChatTurn[] =>
  list
    .filter((m) => m.content.trim() && !(m.role === 'assistant' && m.error))
    .slice(-10)
    .map(({ role, content }) => ({ role, content: content.slice(0, role === 'user' ? MAX_INPUT : 4000) }));

const TypingDial = () => (
  <span className="flex items-center gap-2 text-graphite" role="status">
    <svg viewBox="0 0 24 24" className="w-5 h-5 text-gold" fill="none" stroke="currentColor">
      <circle cx="12" cy="12" r="10" strokeWidth="1.4" />
      <g className="ambient-spin" style={{ animationDuration: '1.2s', transformOrigin: '12px 12px' }}>
        <line x1="12" y1="12" x2="12" y2="4.5" strokeWidth="1.6" strokeLinecap="round" />
      </g>
      <circle cx="12" cy="12" r="1.4" fill="currentColor" />
    </svg>
    <span className="text-xs">Consulting the atelier…</span>
  </span>
);

export const ChatWidget: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(loadMessages);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);

  const { pathname } = useLocation();
  const cartOpen = useCartStore((s) => s.isOpen);
  const abortRef = useRef<AbortController | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const stickToBottom = useRef(true);

  useEffect(() => {
    if (busy) return; // save once the reply settles
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages.slice(-30)));
    } catch {
      /* storage unavailable */
    }
  }, [messages, busy]);

  // Follow the newest text unless the customer has scrolled up to read
  useEffect(() => {
    const box = scrollRef.current;
    if (box && stickToBottom.current) box.scrollTop = box.scrollHeight;
  }, [messages, open, busy]); // `busy` ending adds the watch cards

  useEffect(() => {
    if (!open) return;
    if (!isPhone()) inputRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    const lock = isPhone();
    if (lock) document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      if (lock) document.body.style.overflow = '';
    };
  }, [open]);

  useEffect(() => () => abortRef.current?.abort(), []);

  const run = async (conversation: Message[]) => {
    const reply: Message = { id: newId(), role: 'assistant', content: '' };
    const controller = new AbortController();
    abortRef.current = controller;
    stickToBottom.current = true;
    setMessages([...conversation, reply]);
    setBusy(true);

    const patch = (change: (m: Message) => Message) =>
      setMessages((list) => list.map((m) => (m.id === reply.id ? change(m) : m)));

    try {
      await streamChat(
        toHistory(conversation),
        pathname,
        (delta) => patch((m) => ({ ...m, content: m.content + delta })),
        controller.signal
      );
    } catch (error) {
      if (controller.signal.aborted) {
        // Stopped by the customer: keep any partial text, drop an empty bubble
        setMessages((list) => list.filter((m) => m.id !== reply.id || m.content));
      } else {
        patch((m) => ({ ...m, error: error instanceof Error ? error.message : 'Something went wrong.' }));
      }
    } finally {
      if (abortRef.current === controller) {
        abortRef.current = null;
        setBusy(false);
      }
    }
  };

  const send = (text: string) => {
    const content = text.trim().slice(0, MAX_INPUT);
    if (!content || busy) return;
    setInput('');
    void run([...messages, { id: newId(), role: 'user', content }]);
  };

  const retry = () => {
    if (busy) return;
    void run(messages.slice(0, -1)); // drop the failed reply and ask again
  };

  const reset = () => {
    abortRef.current?.abort();
    abortRef.current = null;
    setBusy(false);
    setMessages([]);
    inputRef.current?.focus();
  };

  // On phones the panel covers the page, so get out of the way after a link tap
  const handleNavigate = () => {
    if (isPhone()) setOpen(false);
  };

  if (cartOpen) return null;

  // Product pages have a bottom "Add to Bag" bar on smaller screens
  const lifted = pathname.startsWith('/watch/') ? 'bottom-28 lg:bottom-6' : 'bottom-5 sm:bottom-6';

  return (
    <>
      <AnimatePresence>
        {!open && (
          <motion.button
            key="launcher"
            initial={{ opacity: 0, scale: 0.5, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: 20 }}
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setOpen(true)}
            aria-label="Open the VK TIME concierge chat"
            className={`group fixed right-4 sm:right-6 ${lifted} z-[45] flex items-center gap-3`}
          >
            <span className="hidden sm:block translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all bg-pure border border-platinum shadow-luxe rounded-full px-4 py-2 text-xs text-charcoal">
              Ask our Concierge
            </span>
            <span className="relative flex items-center justify-center w-14 h-14 rounded-full bg-[#141312] text-gold-light border border-gold shadow-[0_12px_30px_-6px_rgba(0,0,0,0.45)]">
              <span className="absolute inset-0 rounded-full border border-gold animate-ping opacity-30" />
              <MessageCircle className="w-6 h-6" />
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open && (
          <motion.section
            key="panel"
            role="dialog"
            aria-label="VK TIME concierge chat"
            initial={{ opacity: 0, y: 40, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.94 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            style={{ transformOrigin: 'bottom right' }}
            className="fixed z-[60] inset-0 h-[100dvh] sm:inset-auto sm:right-6 sm:bottom-6 sm:w-[400px] sm:h-[min(640px,calc(100dvh-48px))] flex flex-col bg-ivory sm:rounded-2xl sm:border border-gold/50 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.45)] overflow-hidden"
          >
            {/* Header */}
            <header className="flex items-center gap-3 px-4 py-3 bg-[#141312] text-ivory border-b border-gold/60">
              <img
                src={watchArt('vk-chronos-skeleton-limited-41', 'macro')}
                alt=""
                className="w-11 h-11 rounded-full object-cover border border-gold"
              />
              <div className="flex-1 min-w-0">
                <h2 className="font-serif-luxury text-lg leading-tight">VK Concierge</h2>
                <p className="text-[10px] text-ivory/60">AI assistant &bull; may make mistakes</p>
              </div>
              <button
                onClick={reset}
                disabled={!messages.length}
                aria-label="Start a new conversation"
                title="New conversation"
                className="p-2 rounded-full hover:bg-ivory/10 disabled:opacity-30 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close chat"
                className="p-2 rounded-full hover:bg-ivory/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </header>

            {/* Conversation */}
            <div
              ref={scrollRef}
              onScroll={(e) => {
                const el = e.currentTarget;
                stickToBottom.current = el.scrollHeight - el.scrollTop - el.clientHeight < 60;
              }}
              aria-live="polite"
              className="flex-1 overflow-y-auto overscroll-contain px-4 py-4 space-y-3 text-[13px] leading-relaxed text-charcoal"
            >
              <div className="max-w-[90%] bg-pure border border-platinum rounded-2xl rounded-tl-sm px-4 py-3 shadow-subtle">
                Welcome to VK TIME. I can help you choose a watch, find your size, or answer questions about delivery,
                returns and warranty.
              </div>

              {messages.map((m, i) => {
                const streaming = busy && i === messages.length - 1;
                if (m.role === 'user') {
                  return (
                    <div
                      key={m.id}
                      className="ml-auto w-fit max-w-[85%] bg-charcoal text-pure rounded-2xl rounded-tr-sm px-4 py-2.5 whitespace-pre-wrap break-words"
                    >
                      {m.content}
                    </div>
                  );
                }
                return (
                  <div
                    key={m.id}
                    className="max-w-[92%] bg-pure border border-platinum rounded-2xl rounded-tl-sm px-4 py-3 shadow-subtle space-y-2"
                  >
                    {m.content ? (
                      <MessageBody text={m.content} complete={!streaming} onNavigate={handleNavigate} />
                    ) : (
                      !m.error && <TypingDial />
                    )}
                    {m.error && (
                      <div className="text-xs text-red-700" role="alert">
                        {m.error}
                        {i === messages.length - 1 && (
                          <button onClick={retry} className="ml-2 font-medium underline underline-offset-2">
                            Try again
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}

              {!messages.length && (
                <div className="flex flex-col items-start gap-2 pt-1">
                  {SUGGESTIONS.map((s, i) => (
                    <motion.button
                      key={s}
                      initial={{ opacity: 0, x: -16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.15 + i * 0.07 }}
                      onClick={() => send(s)}
                      className="text-left text-xs px-3.5 py-2 rounded-full border border-gold/50 bg-pure hover:bg-charcoal hover:text-pure hover:border-charcoal transition-colors"
                    >
                      {s}
                    </motion.button>
                  ))}
                </div>
              )}
            </div>

            {/* Composer */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                send(input);
              }}
              className="border-t border-platinum bg-pure p-3"
            >
              <div className="flex items-end gap-2 border border-platinum rounded-2xl pl-3.5 pr-1.5 py-1.5 focus-within:border-gold transition-colors">
                <textarea
                  ref={inputRef}
                  value={input}
                  rows={Math.min(4, input.split('\n').length)}
                  maxLength={MAX_INPUT}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    // Ignore Enter while an input method is composing text
                    if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
                      e.preventDefault();
                      send(input);
                    }
                  }}
                  placeholder="Ask about a watch…"
                  aria-label="Your message"
                  className="flex-1 resize-none bg-transparent py-1.5 text-base sm:text-[13px] focus:outline-none placeholder:text-silver"
                />
                {busy ? (
                  <button
                    key="stop"
                    type="button"
                    onClick={() => abortRef.current?.abort()}
                    aria-label="Stop reply"
                    className="w-9 h-9 flex-shrink-0 flex items-center justify-center rounded-full bg-charcoal text-pure hover:bg-gold transition-colors"
                  >
                    <Square className="w-3 h-3 fill-current" />
                  </button>
                ) : (
                  <button
                    key="send"
                    type="submit"
                    disabled={!input.trim()}
                    aria-label="Send message"
                    className="w-9 h-9 flex-shrink-0 flex items-center justify-center rounded-full bg-charcoal text-pure hover:bg-gold disabled:opacity-30 disabled:hover:bg-charcoal transition-colors"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                )}
              </div>
              <p className="pt-1.5 text-center text-[10px] text-silver">
                Please don&apos;t share card or password details.
              </p>
            </form>
          </motion.section>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatWidget;
