/**
 * VK TIME — Procedural Watch Artwork Engine
 * ------------------------------------------------------------------
 * Renders original, brand-accurate wristwatch illustrations as pure SVG
 * strings. The same engine powers:
 *   • the static product / scene artwork written to /public/images
 *   • the live, ticking <LiveWatch /> React component
 * No third-party photography, no external requests, no foreign logos.
 */

export type Metal = 'steel' | 'gold' | 'rose' | 'black' | 'titanium';
export type DialStyle = 'sunburst' | 'matte' | 'guilloche' | 'pearl' | 'skeleton' | 'enamel';
export type MarkerStyle = 'baton' | 'dagger' | 'roman' | 'arabic' | 'dot' | 'none';
export type HandStyle = 'baton' | 'dauphine' | 'sword' | 'leaf' | 'lance';
export type StrapKind = 'leather' | 'mesh' | 'bracelet' | 'dress' | 'rubber' | 'satin';
export type BezelKind = 'thin' | 'ceramic' | 'coin' | 'diamond';
export type BgName = 'ivory' | 'dark' | 'blush' | 'sage' | 'navy' | 'marble' | 'champagne';
export type ViewName = 'front' | 'tilt' | 'macro' | 'flat' | 'bare';

export interface WatchDesign {
  key: string;
  metal: Metal;
  dial: { style: DialStyle; base: string; edge: string; ink: string; sub?: string };
  markers: MarkerStyle;
  markerColor?: string;
  hands: HandStyle;
  handColor: string;
  secondColor: string;
  lume?: string;
  bezel: BezelKind;
  bezelColor?: string;
  strap: { kind: StrapKind; color: string; stitch?: string };
  subdials?: 0 | 1 | 2 | 3 | 'small' | 'moon';
  subdialAccent?: string;
  date?: boolean;
  gmt?: boolean;
  sector?: boolean;
  scale?: number;
  bg: BgName;
  tiltBg?: BgName;
  caption?: string;
}

export interface RenderOptions {
  view?: ViewName;
  uid?: string;
  animate?: boolean;
  time?: { h: number; m: number; s: number };
  bg?: BgName | 'none';
  /** Override canvas background; used by scene composites. */
  transparent?: boolean;
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

const f = (n: number) => (Math.round(n * 100) / 100).toString();
const rad = (deg: number) => (deg * Math.PI) / 180;
const polar = (cx: number, cy: number, r: number, deg: number): [number, number] => [
  cx + r * Math.sin(rad(deg)),
  cy - r * Math.cos(rad(deg)),
];

export function shade(hex: string, amt: number): string {
  let h = hex.replace('#', '');
  if (h.length === 3) h = h.split('').map((c) => c + c).join('');
  const num = parseInt(h, 16);
  let r = (num >> 16) & 255;
  let g = (num >> 8) & 255;
  let b = num & 255;
  const t = amt < 0 ? 0 : 255;
  const p = Math.abs(amt);
  r = Math.round((t - r) * p + r);
  g = Math.round((t - g) * p + g);
  b = Math.round((t - b) * p + b);
  return `#${[r, g, b].map((v) => v.toString(16).padStart(2, '0')).join('')}`;
}

const METALS: Record<Metal, { hi: string; mid: string; lo: string; edge: string }> = {
  steel: { hi: '#fbfcfd', mid: '#c4c9cf', lo: '#7a828b', edge: '#4a5057' },
  gold: { hi: '#fbefc3', mid: '#d6b565', lo: '#8f6c25', edge: '#5a4210' },
  rose: { hi: '#f9e3d4', mid: '#dbab8e', lo: '#9b634a', edge: '#5e3a2b' },
  black: { hi: '#64676d', mid: '#2c2e32', lo: '#0f1012', edge: '#000000' },
  titanium: { hi: '#e3e6e9', mid: '#a0a7ae', lo: '#5f666d', edge: '#383d42' },
};

interface BgDef {
  inner: string;
  outer: string;
  glow: string;
  ring: string;
  dark: boolean;
}

const BGS: Record<BgName, BgDef> = {
  ivory: { inner: '#ffffff', outer: '#e8e2d4', glow: '#e9d9b0', ring: '#b49a73', dark: false },
  champagne: { inner: '#fdf6e6', outer: '#e2d2ae', glow: '#f3dfae', ring: '#b49a73', dark: false },
  blush: { inner: '#fff7f3', outer: '#ecd5cb', glow: '#f6c9bb', ring: '#c58f78', dark: false },
  sage: { inner: '#f6f7f1', outer: '#cdd4c3', glow: '#dfe6cf', ring: '#7f8b6d', dark: false },
  marble: { inner: '#fbfaf8', outer: '#dedad3', glow: '#ffffff', ring: '#9d9d9d', dark: false },
  dark: { inner: '#35312c', outer: '#0b0a09', glow: '#b49a73', ring: '#d4c3a3', dark: true },
  navy: { inner: '#24365a', outer: '#080d1a', glow: '#6d8fd1', ring: '#a9bde6', dark: true },
};

/* ------------------------------------------------------------------ */
/*  Background                                                         */
/* ------------------------------------------------------------------ */

export function backgroundSvg(name: BgName, uid: string, w = 1000, h = 1000): string {
  const b = BGS[name];
  const cx = w / 2;
  const cy = h / 2;
  const maxR = Math.max(w, h);
  const rings = [260, 340, 420, 500]
    .map(
      (r, i) =>
        `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${b.ring}" stroke-opacity="${b.dark ? 0.16 - i * 0.025 : 0.2 - i * 0.04}" stroke-width="1" ${i % 2 ? 'stroke-dasharray="3 9"' : ''}/>`
    )
    .join('');
  const bokeh = [
    [0.14, 0.2, 90, 0.5],
    [0.86, 0.16, 60, 0.4],
    [0.9, 0.78, 120, 0.35],
    [0.08, 0.84, 70, 0.4],
    [0.72, 0.9, 40, 0.5],
  ]
    .map(
      ([x, y, r, o]) =>
        `<circle cx="${f(x * w)}" cy="${f(y * h)}" r="${r}" fill="${b.glow}" fill-opacity="${b.dark ? o * 0.22 : o * 0.55}" filter="url(#${uid}-blur)"/>`
    )
    .join('');
  const marble =
    name === 'marble'
      ? `<g stroke="#8d8a85" stroke-opacity=".13" fill="none" stroke-width="1.2">
          <path d="M-20 160 C 200 210, 300 90, 520 190 S 840 120, 1040 230"/>
          <path d="M-20 700 C 160 640, 360 760, 560 680 S 860 790, 1040 700" stroke-opacity=".1"/>
          <path d="M120 -20 C 180 200, 80 360, 220 560 S 160 900, 260 1040" stroke-opacity=".08"/>
          <path d="M800 -20 C 740 180, 880 340, 780 560 S 880 880, 800 1040" stroke-opacity=".09"/>
        </g>`
      : '';
  return `
    <defs>
      <radialGradient id="${uid}-bg" cx="50%" cy="46%" r="75%">
        <stop offset="0" stop-color="${b.inner}"/>
        <stop offset="1" stop-color="${b.outer}"/>
      </radialGradient>
      <filter id="${uid}-blur" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="${f(maxR * 0.035)}"/></filter>
    </defs>
    <rect width="${w}" height="${h}" fill="url(#${uid}-bg)"/>
    ${marble}
    ${bokeh}
    ${rings}
  `;
}

/* ------------------------------------------------------------------ */
/*  Mechanical Parts (gears / balance wheel)                           */
/* ------------------------------------------------------------------ */

function gearPath(cx: number, cy: number, rOut: number, rRoot: number, teeth: number, rot = 0): string {
  const step = 360 / teeth;
  const pts: string[] = [];
  for (let i = 0; i < teeth; i++) {
    const a = rot + i * step;
    const p = [
      polar(cx, cy, rRoot, a),
      polar(cx, cy, rOut, a + step * 0.16),
      polar(cx, cy, rOut, a + step * 0.4),
      polar(cx, cy, rRoot, a + step * 0.56),
    ];
    pts.push(...p.map(([x, y]) => `${f(x)},${f(y)}`));
  }
  return `M${pts.join(' L')}Z`;
}

export function gearSvg(
  cx: number,
  cy: number,
  r: number,
  teeth: number,
  fill: string,
  cut: string,
  rot = 0,
  spokes = 5
): string {
  const root = r * 0.88;
  const inner = r * 0.62;
  const spokeLines = Array.from({ length: spokes })
    .map((_, i) => {
      const [x, y] = polar(cx, cy, inner + 1, rot + (360 / spokes) * i);
      return `<line x1="${cx}" y1="${cy}" x2="${f(x)}" y2="${f(y)}" stroke="${fill}" stroke-width="${f(r * 0.1)}"/>`;
    })
    .join('');
  return `
    <path d="${gearPath(cx, cy, r, root, teeth, rot)}" fill="${fill}"/>
    <circle cx="${cx}" cy="${cy}" r="${f(inner)}" fill="${cut}"/>
    ${spokeLines}
    <circle cx="${cx}" cy="${cy}" r="${f(r * 0.2)}" fill="${fill}"/>
    <circle cx="${cx}" cy="${cy}" r="${f(r * 0.08)}" fill="${cut}"/>
  `;
}

function balanceWheel(cx: number, cy: number, r: number, metal: string, gold: string, uid: string): string {
  let spiral = '';
  const pts: string[] = [];
  for (let t = 0; t <= Math.PI * 9; t += 0.2) {
    const rr = r * 0.12 + (r * 0.5 * t) / (Math.PI * 9);
    pts.push(`${f(cx + rr * Math.cos(t))},${f(cy + rr * Math.sin(t))}`);
  }
  spiral = `<polyline points="${pts.join(' ')}" fill="none" stroke="${gold}" stroke-width="1.1" stroke-opacity=".9"/>`;
  const screws = Array.from({ length: 12 })
    .map((_, i) => {
      const [x, y] = polar(cx, cy, r * 0.93, i * 30);
      return `<circle cx="${f(x)}" cy="${f(y)}" r="${f(r * 0.045)}" fill="${gold}"/>`;
    })
    .join('');
  return `
    <g>
      <circle cx="${cx}" cy="${cy}" r="${f(r)}" fill="none" stroke="url(#${uid}-metal)" stroke-width="${f(r * 0.12)}"/>
      ${[0, 120, 240]
        .map((a) => {
          const [x, y] = polar(cx, cy, r, a);
          return `<line x1="${cx}" y1="${cy}" x2="${f(x)}" y2="${f(y)}" stroke="${metal}" stroke-width="${f(r * 0.08)}"/>`;
        })
        .join('')}
      ${spiral}
      ${screws}
      <circle cx="${cx}" cy="${cy}" r="${f(r * 0.1)}" fill="${gold}"/>
    </g>
  `;
}

export function movementSvg(cx: number, cy: number, R: number, uid: string, animate = false): string {
  const dark = '#101215';
  const plate = '#1a1d22';
  const spin = (dur: number, dir = 1, x = 0, y = 0) =>
    animate
      ? `<animateTransform attributeName="transform" type="rotate" from="0 ${x} ${y}" to="${360 * dir} ${x} ${y}" dur="${dur}s" repeatCount="indefinite"/>`
      : '';
  const g1x = cx - R * 0.32,
    g1y = cy - R * 0.12;
  const g2x = cx + R * 0.24,
    g2y = cy - R * 0.3;
  const g3x = cx + R * 0.38,
    g3y = cy + R * 0.12;
  const bx = cx - R * 0.05,
    by = cy + R * 0.42;
  const jewel = (x: number, y: number, r = 5) =>
    `<circle cx="${f(x)}" cy="${f(y)}" r="${r + 2.5}" fill="url(#${uid}-metal)"/><circle cx="${f(x)}" cy="${f(y)}" r="${r}" fill="#c4152a"/><circle cx="${f(x - r * 0.3)}" cy="${f(y - r * 0.3)}" r="${f(r * 0.35)}" fill="#fff" fill-opacity=".75"/>`;
  return `
    <rect x="${cx - R}" y="${cy - R}" width="${R * 2}" height="${R * 2}" fill="${plate}"/>
    <circle cx="${cx}" cy="${cy}" r="${R * 0.97}" fill="none" stroke="#2a2f36" stroke-width="2" stroke-dasharray="2 6"/>
    <g transform="translate(${g1x} ${g1y})"><g>${spin(40, 1, 0, 0)}<g transform="translate(${-g1x} ${-g1y})">${gearSvg(g1x, g1y, R * 0.42, 44, `url(#${uid}-metal)`, dark, 0, 6)}</g></g></g>
    <g transform="translate(${g2x} ${g2y})"><g>${spin(26, -1, 0, 0)}<g transform="translate(${-g2x} ${-g2y})">${gearSvg(g2x, g2y, R * 0.26, 30, `url(#${uid}-gold)`, dark, 8, 5)}</g></g></g>
    <g transform="translate(${g3x} ${g3y})"><g>${spin(18, 1, 0, 0)}<g transform="translate(${-g3x} ${-g3y})">${gearSvg(g3x, g3y, R * 0.2, 22, `url(#${uid}-metal)`, dark, 4, 4)}</g></g></g>
    <g transform="translate(${bx} ${by})"><g>${spin(9, 1, 0, 0)}<g transform="translate(${-bx} ${-by})">${balanceWheel(bx, by, R * 0.3, '#9aa3ac', '#d6b565', uid)}</g></g></g>
    <path d="M ${cx - R * 0.9} ${cy + R * 0.2} Q ${cx - R * 0.3} ${cy - R * 0.9} ${cx + R * 0.6} ${cy - R * 0.62}" fill="none" stroke="url(#${uid}-metal)" stroke-width="${f(R * 0.09)}" stroke-linecap="round" stroke-opacity=".92"/>
    <path d="M ${cx + R * 0.15} ${cy + R * 0.95} Q ${cx + R * 0.7} ${cy + R * 0.4} ${cx + R * 0.88} ${cy - R * 0.2}" fill="none" stroke="url(#${uid}-metal)" stroke-width="${f(R * 0.08)}" stroke-linecap="round" stroke-opacity=".92"/>
    ${jewel(cx - R * 0.55, cy - R * 0.5)}
    ${jewel(cx + R * 0.62, cy - R * 0.6, 4.5)}
    ${jewel(cx + R * 0.72, cy + R * 0.32)}
    ${jewel(cx - R * 0.15, cy + R * 0.84, 5.5)}
    ${[
      [-0.7, 0.1],
      [0.55, -0.1],
      [0.1, -0.7],
      [-0.4, 0.62],
    ]
      .map(
        ([x, y]) =>
          `<circle cx="${f(cx + x * R)}" cy="${f(cy + y * R)}" r="4" fill="#d6b565"/><line x1="${f(cx + x * R - 3)}" y1="${f(cy + y * R - 3)}" x2="${f(cx + x * R + 3)}" y2="${f(cy + y * R + 3)}" stroke="#4a3a14" stroke-width="1"/>`
      )
      .join('')}
  `;
}

/* ------------------------------------------------------------------ */
/*  Strap builders                                                     */
/* ------------------------------------------------------------------ */

function strapSvg(d: WatchDesign, uid: string): string {
  const { kind, color, stitch } = d.strap;
  const x0 = 430;
  const x1 = 570;
  const topEnd = { l: 436, r: 564 };
  const pathTop = `M${x0} 345 L${topEnd.l} -80 L${topEnd.r} -80 L${x1} 345Z`;
  const pathBot = `M${x0} 655 L${topEnd.l} 1080 L${topEnd.r} 1080 L${x1} 655Z`;

  const defs = `
    <linearGradient id="${uid}-strapH" x1="0" x2="1" y1="0" y2="0">
      <stop offset="0" stop-color="${shade(color, -0.38)}"/>
      <stop offset=".18" stop-color="${shade(color, -0.05)}"/>
      <stop offset=".5" stop-color="${shade(color, 0.14)}"/>
      <stop offset=".82" stop-color="${shade(color, -0.1)}"/>
      <stop offset="1" stop-color="${shade(color, -0.42)}"/>
    </linearGradient>
    <linearGradient id="${uid}-strapV" x1="0" x2="0" y1="0" y2="1">
      <stop offset="0" stop-color="#000" stop-opacity=".45"/>
      <stop offset=".35" stop-color="#000" stop-opacity=".0"/>
      <stop offset="1" stop-color="#000" stop-opacity=".0"/>
    </linearGradient>
    <linearGradient id="${uid}-strapVb" x1="0" x2="0" y1="1" y2="0">
      <stop offset="0" stop-color="#000" stop-opacity=".45"/>
      <stop offset=".35" stop-color="#000" stop-opacity=".0"/>
      <stop offset="1" stop-color="#000" stop-opacity=".0"/>
    </linearGradient>
    <pattern id="${uid}-mesh" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
      <rect width="6" height="6" fill="none"/>
      <line x1="0" y1="0" x2="0" y2="6" stroke="#000" stroke-opacity=".28" stroke-width="1.1"/>
      <line x1="0" y1="3" x2="6" y2="3" stroke="#fff" stroke-opacity=".35" stroke-width=".9"/>
    </pattern>
    <pattern id="${uid}-ribs" width="140" height="16" patternUnits="userSpaceOnUse">
      <rect width="140" height="16" fill="none"/>
      <rect y="0" width="140" height="3" fill="#000" fill-opacity=".28"/>
      <rect y="3" width="140" height="2" fill="#fff" fill-opacity=".07"/>
    </pattern>
  `;

  if (kind === 'leather' || kind === 'satin' || kind === 'rubber') {
    const stitchColor = stitch || shade(color, 0.5);
    const stitchLines =
      kind === 'leather'
        ? `
      <path d="M440 330 L445.5 -70" stroke="${stitchColor}" stroke-width="2.4" stroke-dasharray="10 8" fill="none" stroke-linecap="round" opacity=".85"/>
      <path d="M560 330 L554.5 -70" stroke="${stitchColor}" stroke-width="2.4" stroke-dasharray="10 8" fill="none" stroke-linecap="round" opacity=".85"/>
      <path d="M440 670 L445.5 1070" stroke="${stitchColor}" stroke-width="2.4" stroke-dasharray="10 8" fill="none" stroke-linecap="round" opacity=".85"/>
      <path d="M560 670 L554.5 1070" stroke="${stitchColor}" stroke-width="2.4" stroke-dasharray="10 8" fill="none" stroke-linecap="round" opacity=".85"/>`
        : '';
    const holes =
      kind === 'leather' || kind === 'rubber'
        ? [770, 830, 890, 950]
            .map(
              (y) =>
                `<circle cx="500" cy="${y}" r="10" fill="#050505" fill-opacity=".78"/><circle cx="500" cy="${y + 2}" r="10" fill="none" stroke="#fff" stroke-opacity=".18" stroke-width="1.5"/>`
            )
            .join('')
        : '';
    const texture =
      kind === 'rubber'
        ? `<path d="${pathTop}" fill="url(#${uid}-ribs)"/><path d="${pathBot}" fill="url(#${uid}-ribs)"/>`
        : kind === 'satin'
          ? `<path d="${pathTop}" fill="#fff" fill-opacity=".1"/>`
          : '';
    return `
      <defs>${defs}</defs>
      <path d="${pathTop}" fill="url(#${uid}-strapH)"/>
      <path d="${pathBot}" fill="url(#${uid}-strapH)"/>
      ${texture}
      <path d="${pathTop}" fill="url(#${uid}-strapV)"/>
      <path d="${pathBot}" fill="url(#${uid}-strapVb)"/>
      ${stitchLines}
      ${holes}
    `;
  }

  if (kind === 'mesh') {
    const metalGrad = `url(#${uid}-metalStrap)`;
    return `
      <defs>${defs}
        <linearGradient id="${uid}-metalStrap" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stop-color="${shade(color, -0.35)}"/>
          <stop offset=".25" stop-color="${shade(color, 0.05)}"/>
          <stop offset=".5" stop-color="${shade(color, 0.35)}"/>
          <stop offset=".75" stop-color="${shade(color, 0)}"/>
          <stop offset="1" stop-color="${shade(color, -0.4)}"/>
        </linearGradient>
      </defs>
      <path d="${pathTop}" fill="${metalGrad}"/><path d="${pathTop}" fill="url(#${uid}-mesh)"/>
      <path d="${pathBot}" fill="${metalGrad}"/><path d="${pathBot}" fill="url(#${uid}-mesh)"/>
      <path d="${pathTop}" fill="url(#${uid}-strapV)"/><path d="${pathBot}" fill="url(#${uid}-strapVb)"/>
      <rect x="426" y="760" width="148" height="14" rx="3" fill="${metalGrad}" stroke="#000" stroke-opacity=".3"/>
    `;
  }

  // Bracelet / Dress links (Metal)
  const links = (dir: 1 | -1) => {
    let out = '';
    const rowH = kind === 'dress' ? 40 : 54;
    for (let i = 0; i < 12; i++) {
      const y = dir === 1 ? 650 + i * rowH : 350 - (i + 1) * rowH;
      const t = i / 12;
      const inset = t * 6;
      if (kind === 'dress') {
        out += `<rect x="${f(x0 + inset)}" y="${f(y + 2)}" width="${f(140 - inset * 2)}" height="${rowH - 4}" rx="6" fill="url(#${uid}-linkH)" stroke="#000" stroke-opacity=".28" stroke-width="1.2"/>
        <line x1="${f(x0 + 12 + inset)}" y1="${f(y + rowH / 2)}" x2="${f(x1 - 12 - inset)}" y2="${f(y + rowH / 2)}" stroke="#fff" stroke-opacity=".28" stroke-width="1"/>`;
      } else {
        out += `<rect x="${f(x0 + inset)}" y="${f(y + 2)}" width="${f(40 - inset * 0.3)}" height="${rowH - 4}" rx="9" fill="url(#${uid}-linkH)" stroke="#000" stroke-opacity=".3" stroke-width="1.2"/>
        <rect x="${f(x0 + 46)}" y="${f(y + 2)}" width="${f(48 - inset * 0.3)}" height="${rowH - 4}" rx="9" fill="url(#${uid}-linkC)" stroke="#000" stroke-opacity=".3" stroke-width="1.2"/>
        <rect x="${f(x0 + 100 - inset * 0.3)}" y="${f(y + 2)}" width="${f(40 - inset * 0.3)}" height="${rowH - 4}" rx="9" fill="url(#${uid}-linkH)" stroke="#000" stroke-opacity=".3" stroke-width="1.2"/>`;
      }
    }
    return out;
  };
  const m = METALS[d.metal];
  return `
    <defs>${defs}
      <linearGradient id="${uid}-linkH" x1="0" x2="1" y1="0" y2="1">
        <stop offset="0" stop-color="${m.lo}"/>
        <stop offset=".35" stop-color="${m.hi}"/>
        <stop offset=".7" stop-color="${m.mid}"/>
        <stop offset="1" stop-color="${m.lo}"/>
      </linearGradient>
      <linearGradient id="${uid}-linkC" x1="0" x2="0" y1="0" y2="1">
        <stop offset="0" stop-color="${m.hi}"/>
        <stop offset=".5" stop-color="${m.mid}"/>
        <stop offset="1" stop-color="${m.lo}"/>
      </linearGradient>
    </defs>
    ${links(-1)}${links(1)}
    <path d="${pathTop}" fill="url(#${uid}-strapV)"/><path d="${pathBot}" fill="url(#${uid}-strapVb)"/>
  `;
}

/* ------------------------------------------------------------------ */
/*  Watch group                                                        */
/* ------------------------------------------------------------------ */

function handsSvg(d: WatchDesign, uid: string, Rd: number, opts: RenderOptions): string {
  const t = opts.time ?? { h: 10, m: 9, s: 36 };
  const hourA = ((t.h % 12) + t.m / 60 + t.s / 3600) * 30;
  const minA = (t.m + t.s / 60) * 6;
  const secA = t.s * 6;
  const lume = d.lume ?? '#f4efd8';

  const hourL = Rd * 0.52;
  const minL = Rd * 0.8;
  const secL = Rd * 0.9;

  const mk = (L: number, w: number, tail: number, style: HandStyle, fill: string, thick: number) => {
    switch (style) {
      case 'dauphine':
        return `
          <path d="M0 ${-L} L${-w} ${-L * 0.3} L0 ${tail} Z" fill="${shade(fill, -0.25)}"/>
          <path d="M0 ${-L} L${w} ${-L * 0.3} L0 ${tail} Z" fill="${fill}"/>
          <path d="M0 ${-L} L0 ${tail}" stroke="#fff" stroke-opacity=".25" stroke-width="1"/>`;
      case 'sword':
        return `
          <path d="M0 ${-L} L${w} ${-L * 0.82} L${w * 0.8} ${tail} L${-w * 0.8} ${tail} L${-w} ${-L * 0.82} Z" fill="${fill}" stroke="${shade(fill, -0.4)}" stroke-width="1"/>
          <path d="M0 ${-L * 0.9} L${w * 0.45} ${-L * 0.8} L${w * 0.4} ${-L * 0.1} L${-w * 0.4} ${-L * 0.1} L${-w * 0.45} ${-L * 0.8} Z" fill="${lume}"/>`;
      case 'leaf':
        return `
          <path d="M0 ${-L} C ${w * 1.9} ${-L * 0.55}, ${w * 1.2} ${-L * 0.2}, 0 ${tail} C ${-w * 1.2} ${-L * 0.2}, ${-w * 1.9} ${-L * 0.55}, 0 ${-L} Z" fill="${fill}"/>
          <path d="M0 ${-L * 0.9} L0 ${tail}" stroke="${shade(fill, -0.45)}" stroke-width="1"/>`;
      case 'lance':
        return `
          <path d="M0 ${-L} L${w * 1.4} ${-L * 0.86} L${w * 0.5} ${-L * 0.78} L${w * 0.5} ${tail} L${-w * 0.5} ${tail} L${-w * 0.5} ${-L * 0.78} L${-w * 1.4} ${-L * 0.86} Z" fill="${fill}"/>`;
      default: // baton
        return `
          <path d="M${-w * 0.75} ${tail} L${-w} ${-L * 0.9} L0 ${-L} L${w} ${-L * 0.9} L${w * 0.75} ${tail} Z" fill="${fill}" stroke="${shade(fill, -0.45)}" stroke-width="1"/>
          <rect x="${-w * 0.38}" y="${-L * 0.86}" width="${w * 0.76}" height="${L * 0.74 + thick}" fill="${lume}" opacity=".92"/>`;
    }
  };

  const rot = (a: number, dur: number, content: string) => {
    const anim = opts.animate
      ? `<animateTransform attributeName="transform" type="rotate" from="${f(a)} 500 500" to="${f(a + 360)} 500 500" dur="${dur}s" repeatCount="indefinite"/>`
      : '';
    return `<g transform="rotate(${f(a)} 500 500)">${anim}<g transform="translate(500 500)">${content}</g></g>`;
  };

  const wHour = d.hands === 'leaf' ? 7 : d.hands === 'sword' ? 11 : d.hands === 'baton' ? 9.5 : 9;
  const wMin = d.hands === 'leaf' ? 5.5 : d.hands === 'sword' ? 8.5 : d.hands === 'baton' ? 7 : 7;

  const gmtHand = d.gmt
    ? rot(
        (t.h + t.m / 60) * 15 + 40,
        86400,
        `<line x1="0" y1="26" x2="0" y2="${-Rd * 0.82}" stroke="#e0782b" stroke-width="2.4"/><path d="M0 ${-Rd * 0.9} L11 ${-Rd * 0.72} L-11 ${-Rd * 0.72} Z" fill="#e0782b"/>`
      )
    : '';

  return `
    <g ${opts.animate ? '' : `filter="url(#${uid}-hs)"`}>
      ${gmtHand}
      ${rot(hourA, 43200, mk(hourL, wHour, 22, d.hands, d.handColor, 12))}
      ${rot(minA, 3600, mk(minL, wMin, 24, d.hands, d.handColor, 12))}
      ${rot(
        secA,
        60,
        `<line x1="0" y1="52" x2="0" y2="${-secL}" stroke="${d.secondColor}" stroke-width="2.6" stroke-linecap="round"/>
         <circle cx="0" cy="${-secL * 0.68}" r="5" fill="${d.secondColor}"/>
         <rect x="-3.5" y="18" width="7" height="34" rx="2" fill="${d.secondColor}"/>`
      )}
      <circle cx="500" cy="500" r="11" fill="url(#${uid}-metal)" stroke="${shade(d.secondColor, -0.35)}" stroke-width="1.2"/>
      <circle cx="500" cy="500" r="4" fill="${d.secondColor}"/>
    </g>
  `;
}

function markersSvg(d: WatchDesign, Rd: number, skip: Set<number>): string {
  const c = d.markerColor ?? '#e9eaec';
  const dark = shade(c, -0.55);
  const ring = Rd;
  let out = '';
  if (d.markers === 'none') return out;

  for (let i = 1; i <= 12; i++) {
    if (skip.has(i)) continue;
    const a = i * 30;
    const [mx, my] = polar(500, 500, ring - 48, a);
    const major = i % 3 === 0;
    switch (d.markers) {
      case 'baton': {
        const len = major || i === 12 ? 40 : 32;
        const wd = major ? 11 : 8;
        out += `<g transform="translate(${f(mx)} ${f(my)}) rotate(${a})"><rect x="${-wd / 2}" y="${-len / 2}" width="${wd}" height="${len}" fill="${c}" stroke="${dark}" stroke-width="1"/><rect x="${-wd / 2 + 1.5}" y="${-len / 2 + 2}" width="${wd / 2 - 1}" height="${len - 4}" fill="#fff" fill-opacity=".45"/></g>`;
        break;
      }
      case 'dagger': {
        const len = 38;
        out += `<g transform="translate(${f(mx)} ${f(my)}) rotate(${a})"><path d="M0 ${-len / 2} L7 ${len / 2} L-7 ${len / 2} Z" fill="${c}" stroke="${dark}" stroke-width="1"/><path d="M0 ${-len / 2} L0 ${len / 2}" stroke="#fff" stroke-opacity=".4"/></g>`;
        break;
      }
      case 'dot': {
        const r = major ? 13 : 10;
        out += `<circle cx="${f(mx)}" cy="${f(my)}" r="${r}" fill="${c}" stroke="${dark}" stroke-width="2"/><circle cx="${f(mx)}" cy="${f(my)}" r="${r - 4}" fill="${d.lume ?? '#f4efd8'}"/>`;
        break;
      }
      case 'roman': {
        const labels = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];
        const [tx, ty] = polar(500, 500, ring - 44, a);
        out += `<text x="${f(tx)}" y="${f(ty + 11)}" text-anchor="middle" font-family="'Cormorant Garamond', Georgia, 'Times New Roman', serif" font-size="${Rd > 160 ? 33 : 29}" font-weight="600" fill="${c}">${labels[i - 1]}</text>`;
        break;
      }
      case 'arabic': {
        const [tx, ty] = polar(500, 500, ring - 46, a);
        out += `<text x="${f(tx)}" y="${f(ty + 13)}" text-anchor="middle" font-family="Inter, 'Helvetica Neue', Arial, sans-serif" font-size="38" font-weight="500" fill="${c}">${i}</text>`;
        break;
      }
    }
  }
  return out;
}

export function watchGroupSvg(d: WatchDesign, uid: string, opts: RenderOptions = {}): string {
  const metal = METALS[d.metal];
  const thin = d.bezel === 'thin' || d.bezel === 'coin';
  const Ro = 202;
  const bezelOuter = 194;
  const bezelInner = thin ? 176 : 150;
  const Rd = bezelInner - 4;
  const isSkeleton = d.dial.style === 'skeleton';
  const ink = d.dial.ink;
  const skip = new Set<number>();
  if (d.date) skip.add(3);
  if (d.subdials === 3) {
    skip.add(3);
    skip.add(6);
    skip.add(9);
  }
  if (d.subdials === 'small') skip.add(6);
  if (d.subdials === 'moon') skip.add(6);
  /* Dial texture */
  let texture = '';
  if (d.dial.style === 'sunburst' || d.dial.style === 'pearl') {
    const wedges: string[] = [];
    for (let i = 0; i < 36; i++) {
      const a0 = i * 10;
      const [x1, y1] = polar(500, 500, Rd + 4, a0);
      const [x2, y2] = polar(500, 500, Rd + 4, a0 + 10);
      wedges.push(
        `<path d="M500 500 L${f(x1)} ${f(y1)} L${f(x2)} ${f(y2)}Z" fill="${i % 2 ? '#000' : '#fff'}" fill-opacity="${i % 2 ? 0.05 : 0.09}"/>`
      );
    }
    texture = wedges.join('');
  } else if (d.dial.style === 'guilloche') {
    texture = Array.from({ length: 22 })
      .map(
        (_, i) =>
          `<circle cx="500" cy="500" r="${6 + i * 7.5}" fill="none" stroke="#fff" stroke-opacity="${i % 2 ? 0.1 : 0.2}" stroke-width="1.2"/>`
      )
      .join('');
    texture += Array.from({ length: 72 })
      .map((_, i) => {
        const [x, y] = polar(500, 500, Rd, i * 5);
        return `<line x1="500" y1="500" x2="${f(x)}" y2="${f(y)}" stroke="#000" stroke-opacity=".06" stroke-width="1"/>`;
      })
      .join('');
  } else if (d.dial.style === 'enamel') {
    texture = `<ellipse cx="430" cy="410" rx="${Rd * 0.7}" ry="${Rd * 0.45}" fill="#fff" fill-opacity=".1" transform="rotate(-30 430 410)"/>`;
  }
  if (d.dial.style === 'pearl') {
    texture += `
      <ellipse cx="420" cy="430" rx="110" ry="70" fill="#ffd9e8" fill-opacity=".45" filter="url(#${uid}-soft)" transform="rotate(-25 420 430)"/>
      <ellipse cx="590" cy="540" rx="120" ry="80" fill="#cfe7ff" fill-opacity=".5" filter="url(#${uid}-soft)" transform="rotate(20 590 540)"/>
      <ellipse cx="500" cy="610" rx="100" ry="50" fill="#fff3c9" fill-opacity=".5" filter="url(#${uid}-soft)"/>`;
  }

  /* Sector / railway hairline */
  const sector = d.sector
    ? `<circle cx="500" cy="500" r="${Rd * 0.74}" fill="none" stroke="${ink}" stroke-opacity=".5" stroke-width="1.4"/>`
    : '';

  /* Minute track */
  const ticks = Array.from({ length: 60 })
    .map((_, i) => {
      const major = i % 5 === 0;
      const [x1, y1] = polar(500, 500, Rd - 8, i * 6);
      const [x2, y2] = polar(500, 500, Rd - (major ? 20 : 15), i * 6);
      return `<line x1="${f(x1)}" y1="${f(y1)}" x2="${f(x2)}" y2="${f(y2)}" stroke="${ink}" stroke-opacity="${major ? 0.9 : 0.55}" stroke-width="${major ? 2.4 : 1.1}"/>`;
    })
    .join('');

  /* Sub-dials */
  const subFill = d.dial.sub ?? shade(d.dial.base, -0.12);
  const acc = d.subdialAccent ?? ink;
  const subdial = (cx: number, cy: number, r: number, handAngle: number) => `
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="${subFill}" stroke="${shade(subFill, -0.3)}" stroke-width="2"/>
    <circle cx="${cx}" cy="${cy}" r="${r - 7}" fill="none" stroke="${ink}" stroke-opacity=".5" stroke-width="1"/>
    ${Array.from({ length: 12 })
      .map((_, i) => {
        const [x1, y1] = polar(cx, cy, r - 4, i * 30);
        const [x2, y2] = polar(cx, cy, r - (i % 3 === 0 ? 14 : 10), i * 30);
        return `<line x1="${f(x1)}" y1="${f(y1)}" x2="${f(x2)}" y2="${f(y2)}" stroke="${ink}" stroke-opacity=".8" stroke-width="${i % 3 === 0 ? 1.8 : 1}"/>`;
      })
      .join('')}
    <line x1="${cx}" y1="${cy}" x2="${f(polar(cx, cy, r - 8, handAngle)[0])}" y2="${f(polar(cx, cy, r - 8, handAngle)[1])}" stroke="${acc}" stroke-width="2.2" stroke-linecap="round"/>
    <circle cx="${cx}" cy="${cy}" r="3.4" fill="${acc}"/>`;

  let subdials = '';
  if (d.subdials === 3) {
    subdials = subdial(430, 500, 44, 40) + subdial(570, 500, 44, 280) + subdial(500, 585, 44, 150);
  } else if (d.subdials === 2) {
    subdials = subdial(430, 500, 44, 40) + subdial(570, 500, 44, 280);
  } else if (d.subdials === 'small') {
    subdials = subdial(500, 600, 38, 210);
  } else if (d.subdials === 'moon') {
    subdials = `
      <g>
        <circle cx="500" cy="600" r="46" fill="#0d1730" stroke="${ink}" stroke-opacity=".8" stroke-width="2.4"/>
        <circle cx="500" cy="600" r="40" fill="#13224a"/>
        <circle cx="478" cy="600" r="30" fill="#f4e7be"/>
        <circle cx="488" cy="594" r="30" fill="#13224a"/>
        ${[
          [520, 584],
          [526, 604],
          [510, 616],
          [530, 590],
        ]
          .map(([x, y]) => `<circle cx="${x}" cy="${y}" r="2" fill="#f4e7be"/>`)
          .join('')}
      </g>`;
  }

  /* Date window */
  const date = d.date
    ? `<g>
        <rect x="${500 + Rd - 78}" y="487" width="40" height="26" rx="2.5" fill="#fbfaf6" stroke="${metal.mid}" stroke-width="3"/>
        <text x="${500 + Rd - 58}" y="506" text-anchor="middle" font-family="Inter, Arial, sans-serif" font-size="17" font-weight="600" fill="#1b1b1b">25</text>
      </g>`
    : '';

  /* Brand mark: monogram + wordmark */
  const tallMarkers = d.markers === 'roman' || d.markers === 'arabic' || d.markers === 'dot';
  const brandY = d.subdials === 3 ? 424 : !thin ? 434 : tallMarkers ? 424 : 396;
  const wordSize = d.subdials === 3 ? 10 : 13;
  const wordSpacing = d.subdials === 3 ? 3 : 5;
  const brand = `
    <g transform="translate(${f(500 - 76 * 0.3)} ${f(brandY - 71 * 0.3)}) scale(0.3)" stroke="${ink}" stroke-width="7" stroke-linecap="square" fill="none">
      <line x1="38" y1="68" x2="60" y2="110"/><line x1="60" y1="110" x2="78" y2="68"/>
      <line x1="84" y1="32" x2="84" y2="110"/><line x1="86" y1="89" x2="111" y2="68"/><line x1="94" y1="80" x2="114" y2="110"/>
    </g>
    <text x="500" y="${brandY + (d.subdials === 3 ? 25 : 30)}" text-anchor="middle" font-family="Inter, 'Helvetica Neue', Arial, sans-serif" font-size="${wordSize}" letter-spacing="${wordSpacing}" fill="${ink}" fill-opacity=".9" font-weight="500">VK TIME</text>`;
  const caption = d.caption
    ? `<text x="500" y="${d.subdials === 'small' || d.subdials === 'moon' ? 668 : 640}" text-anchor="middle" font-family="Inter, Arial, sans-serif" font-size="10" letter-spacing="3" fill="${ink}" fill-opacity=".7">${d.caption}</text>`
    : '';

  /* Bezel decorations */
  let bezelExtra = '';
  const bc = d.bezelColor ?? '#14161a';
  if (d.bezel === 'ceramic') {
    bezelExtra = `
      <circle cx="500" cy="500" r="${(bezelOuter + bezelInner) / 2}" fill="none" stroke="${bc}" stroke-width="${bezelOuter - bezelInner}"/>
      <circle cx="500" cy="500" r="${(bezelOuter + bezelInner) / 2}" fill="none" stroke="url(#${uid}-ceramicShine)" stroke-width="${bezelOuter - bezelInner}"/>
      ${Array.from({ length: 60 })
        .map((_, i) => {
          const [x1, y1] = polar(500, 500, bezelOuter - 4, i * 6);
          const [x2, y2] = polar(500, 500, bezelOuter - (i % 5 === 0 ? 17 : 11), i * 6);
          return `<line x1="${f(x1)}" y1="${f(y1)}" x2="${f(x2)}" y2="${f(y2)}" stroke="#f1f1f1" stroke-opacity=".9" stroke-width="${i % 5 === 0 ? 2.6 : 1.3}"/>`;
        })
        .join('')}
      ${[0, 15, 30, 45]
        .map((n) => {
          if (n === 0) return `<path d="M500 ${500 - bezelOuter + 6} l-7 14 h14 z" fill="#f1f1f1"/>`;
          const [x, y] = polar(500, 500, bezelOuter - 24, n * 6);
          return `<text x="${f(x)}" y="${f(y + 5)}" text-anchor="middle" font-family="Inter, Arial, sans-serif" font-size="14" font-weight="600" fill="#f1f1f1">${n}</text>`;
        })
        .join('')}`;
  } else if (d.bezel === 'diamond') {
    const n = 48;
    bezelExtra = Array.from({ length: n })
      .map((_, i) => {
        const [x, y] = polar(500, 500, (bezelOuter + bezelInner) / 2 + 1, (i * 360) / n);
        return `<circle cx="${f(x)}" cy="${f(y)}" r="5.2" fill="url(#${uid}-diamond)" stroke="${metal.lo}" stroke-width="1.2"/><circle cx="${f(x - 1.4)}" cy="${f(y - 1.6)}" r="1.4" fill="#fff"/>`;
      })
      .join('');
  } else if (d.bezel === 'coin') {
    bezelExtra = Array.from({ length: 120 })
      .map((_, i) => {
        const [x1, y1] = polar(500, 500, bezelOuter, i * 3);
        const [x2, y2] = polar(500, 500, bezelInner + 2, i * 3);
        return `<line x1="${f(x1)}" y1="${f(y1)}" x2="${f(x2)}" y2="${f(y2)}" stroke="${metal.edge}" stroke-opacity=".45" stroke-width="1.2"/>`;
      })
      .join('');
  }

  const pushers =
    d.subdials === 3 || d.subdials === 2
      ? [-32, 32]
          .map(
            (a) =>
              `<g transform="rotate(${a + 90} 500 500)"><rect x="${500 + Ro - 2}" y="488" width="30" height="24" rx="4" fill="url(#${uid}-metalV)" stroke="${metal.edge}" stroke-width="1.4"/><rect x="${500 + Ro + 26}" y="484" width="9" height="32" rx="3" fill="url(#${uid}-metalV)" stroke="${metal.edge}" stroke-width="1.2"/></g>`
          )
          .join('')
      : '';

  const crown = `
    <g>
      <rect x="${500 + Ro - 4}" y="486" width="18" height="28" fill="${metal.lo}"/>
      <rect x="${500 + Ro + 10}" y="470" width="34" height="60" rx="8" fill="url(#${uid}-metalV)" stroke="${metal.edge}" stroke-width="1.6"/>
      ${Array.from({ length: 9 })
        .map(
          (_, i) =>
            `<line x1="${500 + Ro + 13 + i * 3.4}" y1="475" x2="${500 + Ro + 13 + i * 3.4}" y2="525" stroke="${metal.edge}" stroke-opacity=".55" stroke-width="1.4"/>`
        )
        .join('')}
    </g>`;

  const lugs = `
    <g id="${uid}-lugTL">
      <path d="M392 330 L402 274 Q406 256 424 256 L432 256 L432 340 Z" fill="url(#${uid}-metalV)" stroke="${metal.edge}" stroke-width="1.6"/>
      <path d="M404 276 Q408 262 424 262" fill="none" stroke="#fff" stroke-opacity=".7" stroke-width="2.4" stroke-linecap="round"/>
      <circle cx="431" cy="300" r="3.6" fill="${metal.lo}"/>
    </g>
    <use href="#${uid}-lugTL" transform="matrix(-1 0 0 1 1000 0)"/>
    <use href="#${uid}-lugTL" transform="matrix(1 0 0 -1 0 1000)"/>
    <use href="#${uid}-lugTL" transform="matrix(-1 0 0 -1 1000 1000)"/>`;

  const dialFill = isSkeleton ? '#101215' : `url(#${uid}-dial)`;
  return `
  <defs>
    <linearGradient id="${uid}-metal" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${metal.hi}"/>
      <stop offset=".35" stop-color="${metal.mid}"/>
      <stop offset=".62" stop-color="${metal.hi}"/>
      <stop offset="1" stop-color="${metal.lo}"/>
    </linearGradient>
    <linearGradient id="${uid}-metalV" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="${metal.lo}"/>
      <stop offset=".3" stop-color="${metal.hi}"/>
      <stop offset=".55" stop-color="${metal.mid}"/>
      <stop offset="1" stop-color="${metal.lo}"/>
    </linearGradient>
    <linearGradient id="${uid}-gold" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#fbefc3"/><stop offset=".5" stop-color="#d6b565"/><stop offset="1" stop-color="#8f6c25"/>
    </linearGradient>
    <linearGradient id="${uid}-bezel" x1="1" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${metal.lo}"/>
      <stop offset=".25" stop-color="${metal.hi}"/>
      <stop offset=".55" stop-color="${metal.mid}"/>
      <stop offset=".8" stop-color="${metal.hi}"/>
      <stop offset="1" stop-color="${metal.lo}"/>
    </linearGradient>
    <linearGradient id="${uid}-ceramicShine" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#fff" stop-opacity=".32"/><stop offset=".4" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#fff" stop-opacity=".12"/>
    </linearGradient>
    <radialGradient id="${uid}-dial" cx="50%" cy="42%" r="72%">
      <stop offset="0" stop-color="${d.dial.base}"/>
      <stop offset="1" stop-color="${d.dial.edge}"/>
    </radialGradient>
    <radialGradient id="${uid}-diamond" cx="35%" cy="30%" r="80%">
      <stop offset="0" stop-color="#fff"/><stop offset=".5" stop-color="#dfeaff"/><stop offset="1" stop-color="#a9b9d6"/>
    </radialGradient>
    <linearGradient id="${uid}-glare" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#fff" stop-opacity=".5"/>
      <stop offset=".42" stop-color="#fff" stop-opacity=".08"/>
      <stop offset=".5" stop-color="#fff" stop-opacity="0"/>
      <stop offset=".78" stop-color="#fff" stop-opacity=".0"/>
      <stop offset="1" stop-color="#fff" stop-opacity=".16"/>
    </linearGradient>
    <clipPath id="${uid}-dialClip"><circle cx="500" cy="500" r="${Rd}"/></clipPath>
    <filter id="${uid}-hs" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="3" dy="6" stdDeviation="3.2" flood-color="#000" flood-opacity=".38"/></filter>
    <filter id="${uid}-soft" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="22"/></filter>
    <filter id="${uid}-drop" x="-30%" y="-20%" width="160%" height="150%"><feDropShadow dx="0" dy="26" stdDeviation="26" flood-color="#000" flood-opacity=".34"/></filter>
  </defs>

  <g filter="url(#${uid}-drop)">
    ${strapSvg(d, uid)}
    ${lugs}
    ${pushers}
    ${crown}
    <circle cx="500" cy="500" r="${Ro}" fill="url(#${uid}-metal)" stroke="${metal.edge}" stroke-width="2"/>
    <circle cx="500" cy="500" r="${Ro - 6}" fill="none" stroke="#fff" stroke-opacity=".45" stroke-width="1.5"/>
    <circle cx="500" cy="500" r="${bezelOuter}" fill="url(#${uid}-bezel)" stroke="${metal.edge}" stroke-opacity=".6" stroke-width="1.2"/>
    ${bezelExtra}
    <circle cx="500" cy="500" r="${bezelInner}" fill="${metal.lo}" stroke="${metal.edge}" stroke-width="1.6"/>
    <circle cx="500" cy="500" r="${bezelInner - 2}" fill="none" stroke="#000" stroke-opacity=".35" stroke-width="2"/>
  </g>


    <g clip-path="url(#${uid}-dialClip)">
      <circle cx="500" cy="500" r="${Rd}" fill="${dialFill}"/>
      ${isSkeleton ? movementSvg(500, 500, Rd, uid, !!opts.animate) : texture + sector}
      <circle cx="500" cy="500" r="${Rd}" fill="none" stroke="#000" stroke-opacity=".3" stroke-width="10"/>
    </g>
    <g>
      ${ticks}
      ${markersSvg(d, Rd, skip)}
      ${isSkeleton ? '' : subdials}
      ${isSkeleton ? '' : date}
      ${isSkeleton ? `<text x="500" y="${500 - Rd + 90}" text-anchor="middle" stroke="#101215" stroke-width="4" paint-order="stroke" font-family="Inter, Arial, sans-serif" font-size="13" letter-spacing="5" fill="${ink}" font-weight="500">VK TIME</text>` : brand}
      ${isSkeleton ? '' : caption}
    </g>
    ${handsSvg(d, uid, Rd, opts)}

    <g clip-path="url(#${uid}-dialClip)">
      <rect x="${500 - Rd}" y="${500 - Rd}" width="${Rd * 2}" height="${Rd * 2}" fill="url(#${uid}-glare)"/>
    </g>
    <circle cx="500" cy="500" r="${Rd}" fill="none" stroke="#fff" stroke-opacity=".38" stroke-width="2"/>
    <path d="M ${f(polar(500, 500, bezelOuter - 3, -62)[0])} ${f(polar(500, 500, bezelOuter - 3, -62)[1])} A ${bezelOuter - 3} ${bezelOuter - 3} 0 0 1 ${f(polar(500, 500, bezelOuter - 3, -8)[0])} ${f(polar(500, 500, bezelOuter - 3, -8)[1])}" fill="none" stroke="#fff" stroke-opacity=".6" stroke-width="3" stroke-linecap="round"/>`;
}

/* ------------------------------------------------------------------ */
/*  Full documents                                                     */
/* ------------------------------------------------------------------ */

export function renderWatch(d: WatchDesign, opts: RenderOptions = {}): string {
  const view = opts.view ?? 'front';
  const uid = opts.uid ?? `w${d.key.replace(/[^a-z0-9]/gi, '')}${view}`;
  const scale = d.scale ?? 1;
  const bgName: BgName | 'none' =
    opts.bg ??
    (view === 'tilt' ? (d.tiltBg ?? 'dark') : view === 'flat' ? 'marble' : view === 'bare' ? 'none' : d.bg);

  let vb = '0 0 1000 1000';
  let transform = `translate(500 500) scale(${scale}) translate(-500 -500)`;
  if (view === 'tilt') {
    transform = `translate(500 500) rotate(-24) scale(${scale * 0.9}) translate(-500 -500)`;
  } else if (view === 'flat') {
    transform = `translate(500 500) rotate(13) scale(${scale * 0.94}) translate(-500 -520)`;
  } else if (view === 'macro') {
    vb = '215 215 570 570';
  } else if (view === 'bare') {
    vb = '270 -40 460 1080';
    transform = `translate(500 500) scale(${scale}) translate(-500 -500)`;
  }

  const bg = bgName === 'none' || opts.transparent ? '' : backgroundSvg(bgName as BgName, uid);
  const inner = watchGroupSvg(d, uid, opts);

  const sizeAttr = view === 'bare' ? 'width="460" height="1080"' : 'width="1000" height="1000"';

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb}" ${sizeAttr} preserveAspectRatio="xMidYMid ${view === 'macro' ? 'slice' : 'meet'}" role="img" aria-label="VK TIME watch">${bg}<g transform="${transform}">${inner}</g></svg>`;
}
