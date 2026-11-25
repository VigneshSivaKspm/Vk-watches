import React, { useMemo } from 'react';
import { renderWatch, ViewName } from '../../lib/watchArt/engine';
import { getDesign } from '../../lib/watchArt/designs';

interface LiveWatchProps {
  slug: string;
  view?: Extract<ViewName, 'bare' | 'macro' | 'front'>;
  alt?: boolean;
  className?: string;
}

/** An inline, real-time VK TIME watch: hands sweep and the movement turns. */
export const LiveWatch: React.FC<LiveWatchProps> = ({ slug, view = 'bare', alt = false, className = '' }) => {
  const uid = React.useId().replace(/[^a-zA-Z0-9]/g, '');

  const markup = useMemo(() => {
    const now = new Date();
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    return renderWatch(getDesign(slug, alt), {
      view,
      uid: `live${uid}`,
      animate: !reduced,
      time: { h: now.getHours(), m: now.getMinutes(), s: now.getSeconds() },
      transparent: view !== 'front' && view !== 'macro',
    });
  }, [slug, view, alt, uid]);

  return (
    <div
      className={`live-watch ${className}`}
      // Markup is generated locally by our own artwork engine (no user input).
      dangerouslySetInnerHTML={{ __html: markup }}
    />
  );
};

export default LiveWatch;
