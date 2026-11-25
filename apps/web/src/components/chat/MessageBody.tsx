/**
 * Renders assistant replies: paragraphs, lists, bold and in-site links.
 * Builds React elements only (no raw HTML), so model output cannot inject markup.
 */
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { watchArt } from '../../lib/images';

/** Models sometimes use typographic dashes or hidden spaces inside URLs. */
const cleanPath = (url: string) =>
  url.replace(/[‐-―−]/g, '-').replace(/[\s​ ⁠]/g, '');

/** Only same-site paths become links. */
const isInternal = (url: string) => /^\/(?!\/)[a-z0-9\-/?=&_%]*$/i.test(url);

const INLINE = /\[([^\]]+)\]\(([^)]+)\)|\*\*([^*]+)\*\*|\*([^*\n]+)\*/g;

function renderInline(text: string, onNavigate: () => void): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  let last = 0;
  for (const match of text.matchAll(INLINE)) {
    const [full, label, url, bold, italic] = match;
    const at = match.index ?? 0;
    if (at > last) nodes.push(text.slice(last, at));

    if (label !== undefined) {
      const path = cleanPath(url);
      nodes.push(
        isInternal(path) ? (
          <Link
            key={at}
            to={path}
            onClick={onNavigate}
            className="font-medium text-gold-dark underline underline-offset-2 hover:text-charcoal"
          >
            {label.replace(/\*\*/g, '')}
          </Link>
        ) : (
          label
        )
      );
    } else if (bold !== undefined) {
      nodes.push(
        <strong key={at} className="font-semibold">
          {renderInline(bold, onNavigate)}
        </strong>
      );
    } else {
      nodes.push(<em key={at}>{italic}</em>);
    }
    last = at + full.length;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
}

/** Visual shortcut cards for every watch mentioned in a reply. */
const WatchCards: React.FC<{ text: string; onNavigate: () => void }> = ({ text, onNavigate }) => {
  const [hidden, setHidden] = useState<string[]>([]);
  const found = new Map<string, string>();
  for (const [, label, url] of text.matchAll(/\[([^\]]+)\]\(([^)]+)\)/g)) {
    const slug = cleanPath(url).match(/^\/watch\/([a-z0-9-]+)$/)?.[1];
    if (slug) found.set(slug, label.replace(/\*\*/g, ''));
  }
  const cards = [...found].filter(([slug]) => !hidden.includes(slug)).slice(0, 3);
  if (!cards.length) return null;

  return (
    <div className="grid grid-cols-3 gap-2 pt-1">
      {cards.map(([slug, name]) => (
        <Link
          key={slug}
          to={`/watch/${slug}`}
          onClick={onNavigate}
          className="group block bg-pure border border-platinum rounded-lg overflow-hidden hover:border-gold hover:-translate-y-0.5 transition-all"
        >
          <img
            src={watchArt(slug)}
            alt={name}
            onError={() => setHidden((list) => [...list, slug])}
            className="w-full aspect-square object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <span className="relative flex items-start justify-between gap-1 px-2 py-1.5 bg-pure text-[10px] leading-tight text-charcoal">
            <span className="line-clamp-2">{name.replace(/^VK /, '')}</span>
            <ArrowUpRight className="w-3 h-3 flex-shrink-0 text-gold" />
          </span>
        </Link>
      ))}
    </div>
  );
};

interface MessageBodyProps {
  text: string;
  /** Cards are added once the reply has finished streaming. */
  complete: boolean;
  onNavigate: () => void;
}

export const MessageBody: React.FC<MessageBodyProps> = ({ text, complete, onNavigate }) => {
  const blocks: React.ReactNode[] = [];
  let list: string[] = [];

  const flushList = () => {
    if (!list.length) return;
    blocks.push(
      <ul key={`list-${blocks.length}`} className="space-y-1.5">
        {list.map((item, i) => (
          <li key={i} className="flex gap-2">
            <span className="mt-[7px] w-1.5 h-1.5 rotate-45 bg-gold flex-shrink-0" />
            <span>{renderInline(item, onNavigate)}</span>
          </li>
        ))}
      </ul>
    );
    list = [];
  };

  for (const raw of text.split('\n')) {
    const line = raw.trim();
    const bullet = line.match(/^(?:[-*•]|\d+[.)])\s+(.*)$/);
    if (bullet) {
      list.push(bullet[1]);
      continue;
    }
    flushList();
    if (line) {
      blocks.push(<p key={`p-${blocks.length}`}>{renderInline(line.replace(/^#+\s*/, ''), onNavigate)}</p>);
    }
  }
  flushList();

  return (
    <div className="space-y-2 break-words">
      {blocks}
      {complete && <WatchCards text={text} onNavigate={onNavigate} />}
    </div>
  );
};

export default MessageBody;
