/**
 * Composite editorial artwork: collection heroes, journal covers,
 * lifestyle tiles. All pure SVG, built on the watch engine.
 */
import { BgName, gearSvg, movementSvg, backgroundSvg, watchGroupSvg } from './engine';
import { getDesign } from './designs';

const f = (n: number) => (Math.round(n * 100) / 100).toString();
const polar = (cx: number, cy: number, r: number, deg: number): [number, number] => [
  cx + r * Math.sin((deg * Math.PI) / 180),
  cy - r * Math.cos((deg * Math.PI) / 180),
];

interface Palette {
  a: string;
  b: string;
  accent: string;
}

const doc = (w: number, h: number, body: string) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" preserveAspectRatio="xMidYMid slice">${body}</svg>`;

const backdrop = (id: string, w: number, h: number, p: Palette, gx = 0.7, gy = 0.45) => `
  <defs>
    <linearGradient id="${id}-g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${p.a}"/><stop offset="1" stop-color="${p.b}"/>
    </linearGradient>
    <radialGradient id="${id}-glow" cx="${gx}" cy="${gy}" r=".55">
      <stop offset="0" stop-color="${p.accent}" stop-opacity=".55"/><stop offset="1" stop-color="${p.accent}" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="${id}-metal" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#fbfcfd"/><stop offset=".45" stop-color="#aab1b8"/><stop offset=".7" stop-color="#eef0f2"/><stop offset="1" stop-color="#6f767e"/>
    </linearGradient>
    <linearGradient id="${id}-gold" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#fbefc3"/><stop offset=".5" stop-color="#d6b565"/><stop offset="1" stop-color="#8f6c25"/>
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="url(#${id}-g)"/>
  <rect width="${w}" height="${h}" fill="url(#${id}-glow)"/>
`;

const dialRings = (cx: number, cy: number, r: number, color: string, op = 0.35) => {
  const ticks = Array.from({ length: 120 })
    .map((_, i) => {
      const major = i % 10 === 0;
      const [x1, y1] = polar(cx, cy, r, i * 3);
      const [x2, y2] = polar(cx, cy, r - (major ? r * 0.07 : r * 0.028), i * 3);
      return `<line x1="${f(x1)}" y1="${f(y1)}" x2="${f(x2)}" y2="${f(y2)}" stroke="${color}" stroke-width="${major ? 2.4 : 1}"/>`;
    })
    .join('');
  return `<g opacity="${op}" fill="none">${ticks}
    <circle cx="${cx}" cy="${cy}" r="${r * 1.07}" stroke="${color}" stroke-width="1"/>
    <circle cx="${cx}" cy="${cy}" r="${r * 0.82}" stroke="${color}" stroke-width="1" stroke-dasharray="3 8"/>
    <circle cx="${cx}" cy="${cy}" r="${r * 0.55}" stroke="${color}" stroke-width=".8"/></g>`;
};

const gearCluster = (id: string, cx: number, cy: number, s: number, cut: string, op = 0.5) =>
  `<g opacity="${op}">
    ${gearSvg(cx, cy, 190 * s, 52, `url(#${id}-gold)`, cut, 0, 6)}
    ${gearSvg(cx + 245 * s, cy + 105 * s, 100 * s, 28, `url(#${id}-metal)`, cut, 9, 5)}
    ${gearSvg(cx + 120 * s, cy - 215 * s, 74 * s, 22, `url(#${id}-metal)`, cut, 4, 4)}
    ${gearSvg(cx - 190 * s, cy + 170 * s, 82 * s, 24, `url(#${id}-metal)`, cut, 2, 4)}
  </g>`;

const placeWatch = (
  slug: string,
  id: string,
  x: number,
  y: number,
  scale: number,
  rot: number,
  alt = false
) =>
  `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${scale}) translate(-500 -500)">${watchGroupSvg(getDesign(slug, alt), id)}</g>`;

/* ---------------- Collection heroes (1600 × 900) ------------------ */
export interface SceneDef {
  name: string;
  svg: () => string;
}

const hero = (
  name: string,
  pal: Palette,
  motif: 'gears' | 'rings' | 'lines' | 'speed',
  main: string,
  second: string
): SceneDef => ({
  name,
  svg: () => {
    const id = name.replace(/[^a-z]/gi, '');
    const motifSvg =
      motif === 'gears'
        ? gearCluster(id, 330, 470, 1.35, pal.b, 0.32)
        : motif === 'rings'
          ? dialRings(1150, 450, 520, pal.accent, 0.35) + dialRings(220, 760, 300, pal.accent, 0.2)
          : motif === 'speed'
            ? Array.from({ length: 22 })
                .map(
                  (_, i) =>
                    `<rect x="${(i * 197) % 900}" y="${60 + i * 37}" width="${180 + ((i * 83) % 420)}" height="${i % 4 === 0 ? 3 : 1.2}" fill="${pal.accent}" opacity="${0.12 + (i % 5) * 0.06}"/>`
                )
                .join('') + dialRings(1130, 450, 480, pal.accent, 0.3)
            : Array.from({ length: 28 })
                .map(
                  (_, i) =>
                    `<line x1="${i * 66}" y1="0" x2="${i * 66 - 340}" y2="900" stroke="${pal.accent}" stroke-width="1" opacity=".14"/>`
                )
                .join('') + dialRings(1150, 450, 470, pal.accent, 0.28);
    return doc(
      1600,
      900,
      `${backdrop(id, 1600, 900, pal, 0.72, 0.5)}${motifSvg}
       ${placeWatch(second, `${id}b`, 1335, 500, 0.66, 20)}
       ${placeWatch(main, `${id}a`, 1030, 450, 0.98, -16)}`
    );
  },
});

/* ---------------- Portrait collection thumbnails (800 × 1000) ----- */
const thumb = (name: string, pal: Palette, slug: string): SceneDef => ({
  name,
  svg: () => {
    const id = name.replace(/[^a-z]/gi, '');
    return doc(
      800,
      1000,
      `${backdrop(id, 800, 1000, pal, 0.5, 0.45)}${dialRings(400, 480, 360, pal.accent, 0.35)}
       ${placeWatch(slug, `${id}w`, 400, 500, 0.92, -14)}`
    );
  },
});

/* ---------------- Lifestyle duo tiles (1200 × 900) ---------------- */
const duo = (name: string, pal: Palette, a: string, b: string, motif: 'gears' | 'rings'): SceneDef => ({
  name,
  svg: () => {
    const id = name.replace(/[^a-z]/gi, '');
    return doc(
      1200,
      900,
      `${backdrop(id, 1200, 900, pal, 0.55, 0.35)}
       ${motif === 'gears' ? gearCluster(id, 940, 250, 1.1, pal.b, 0.28) : dialRings(600, 400, 420, pal.accent, 0.4)}
       ${placeWatch(a, `${id}a`, 430, 380, 0.72, -24)}
       ${placeWatch(b, `${id}b`, 820, 430, 0.62, 18)}`
    );
  },
});

/* ---------------- Journal covers (1200 × 750) --------------------- */
const coverMovement: SceneDef = {
  name: 'journal-movement',
  svg: () =>
    doc(
      1200,
      750,
      `${backdrop('jm', 1200, 750, { a: '#1c1f25', b: '#07080a', accent: '#b49a73' }, 0.5, 0.5)}
       ${dialRings(600, 375, 345, '#d4c3a3', 0.35)}
       <clipPath id="jm-c"><circle cx="600" cy="375" r="300"/></clipPath>
       <g clip-path="url(#jm-c)">${movementSvg(600, 375, 300, 'jm')}</g>
       <circle cx="600" cy="375" r="302" fill="none" stroke="url(#jm-metal)" stroke-width="16"/>`
    ),
};

const coverProportion: SceneDef = {
  name: 'journal-proportion',
  svg: () => {
    const dims = (x1: number, y1: number, x2: number, y2: number, label: string, lx: number, ly: number) =>
      `<g stroke="#8c7551" stroke-width="2"><line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/><circle cx="${x1}" cy="${y1}" r="4" fill="#8c7551"/><circle cx="${x2}" cy="${y2}" r="4" fill="#8c7551"/></g><text x="${lx}" y="${ly}" font-family="Georgia, serif" font-size="26" fill="#5c4c33" text-anchor="middle">${label}</text>`;
    const grid =
      Array.from({ length: 25 })
        .map((_, i) => `<line x1="${i * 50}" y1="0" x2="${i * 50}" y2="750" stroke="#b49a73" stroke-opacity=".16"/>`)
        .join('') +
      Array.from({ length: 16 })
        .map((_, i) => `<line x1="0" y1="${i * 50}" x2="1200" y2="${i * 50}" stroke="#b49a73" stroke-opacity=".16"/>`)
        .join('');
    return doc(
      1200,
      750,
      `${backdrop('jp', 1200, 750, { a: '#faf6ec', b: '#e6dcc4', accent: '#ffffff' }, 0.5, 0.5)}${grid}
       ${placeWatch('vk-heritage-automatic-39', 'jpw', 600, 380, 0.82, 0)}
       ${dims(434, 380, 330, 380, '39 mm case', 220, 330)}
       ${dims(870, 170, 870, 590, '47 mm  lug-to-lug', 1015, 388)}
       ${dialRings(180, 380, 130, '#8c7551', 0.35)}`
    );
  },
};

const coverSapphire: SceneDef = {
  name: 'journal-sapphire',
  svg: () => {
    const facets = Array.from({ length: 16 })
      .map((_, i) => {
        const [x1, y1] = polar(600, 375, 300, i * 22.5);
        const [x2, y2] = polar(600, 375, 300, (i + 1) * 22.5);
        const [m1, n1] = polar(600, 375, 170, i * 22.5 + 11.25);
        return `<path d="M${f(x1)} ${f(y1)} L${f(x2)} ${f(y2)} L${f(m1)} ${f(n1)}Z" fill="#cfe3ff" fill-opacity="${0.07 + (i % 4) * 0.07}" stroke="#e8f1ff" stroke-opacity=".5"/>
        <path d="M600 375 L${f(m1)} ${f(n1)} L${f(x1)} ${f(y1)}Z" fill="#8fb6ff" fill-opacity="${0.05 + (i % 3) * 0.07}" stroke="#e8f1ff" stroke-opacity=".35"/>`;
      })
      .join('');
    const sparkle = (x: number, y: number, s: number) =>
      `<path d="M${x} ${y - s} Q${x} ${y} ${x + s} ${y} Q${x} ${y} ${x} ${y + s} Q${x} ${y} ${x - s} ${y} Q${x} ${y} ${x} ${y - s}Z" fill="#fff"/>`;
    return doc(
      1200,
      750,
      `${backdrop('js', 1200, 750, { a: '#1e3565', b: '#060b19', accent: '#7fa8f0' }, 0.5, 0.45)}
       ${facets}${sparkle(380, 180, 44)}${sparkle(860, 520, 30)}${sparkle(790, 140, 20)}${sparkle(330, 560, 16)}`
    );
  },
};

const coverLeather: SceneDef = {
  name: 'journal-leather',
  svg: () =>
    doc(
      1200,
      750,
      `${backdrop('jl', 1200, 750, { a: '#7a4a2a', b: '#2b170c', accent: '#e2a96f' }, 0.6, 0.4)}
       ${Array.from({ length: 9 })
         .map(
           (_, i) =>
             `<path d="M-50 ${60 + i * 90} C 300 ${10 + i * 90}, 700 ${150 + i * 90}, 1250 ${40 + i * 90}" fill="none" stroke="#f0d4b0" stroke-opacity=".28" stroke-width="2.5" stroke-dasharray="14 11"/>`
         )
         .join('')}
       ${placeWatch('vk-halcyon-classic-37', 'jlw', 440, 390, 0.78, -32)}
       ${placeWatch('vk-statesman-handwound-38', 'jlx', 820, 380, 0.78, 22)}`
    ),
};

const coverTravel: SceneDef = {
  name: 'journal-travel',
  svg: () => {
    const globe = `<g fill="none" stroke="#9fd6dc" stroke-opacity=".4" stroke-width="1.5">
      <circle cx="800" cy="375" r="330"/>
      ${[60, 150, 250].map((rx) => `<ellipse cx="800" cy="375" rx="${rx}" ry="330"/>`).join('')}
      ${[80, 190, 290].map((ry) => `<ellipse cx="800" cy="375" rx="330" ry="${ry}"/>`).join('')}
      <path d="M90 560 Q 420 120 1010 180" stroke="#e0782b" stroke-opacity=".9" stroke-dasharray="10 12" stroke-width="3"/></g>`;
    return doc(
      1200,
      750,
      `${backdrop('jt', 1200, 750, { a: '#0f4a53', b: '#031518', accent: '#35b5c2' }, 0.65, 0.5)}${globe}
       ${placeWatch('vk-equinox-gmt-40', 'jtw', 410, 400, 0.85, -14)}`
    );
  },
};

const coverCare: SceneDef = {
  name: 'journal-care',
  svg: () => {
    const drop = (x: number, y: number, r: number) =>
      `<g><ellipse cx="${x}" cy="${y}" rx="${r}" ry="${r * 1.08}" fill="#fff" fill-opacity=".16" stroke="#fff" stroke-opacity=".55"/><circle cx="${x - r * 0.35}" cy="${y - r * 0.38}" r="${r * 0.2}" fill="#fff" fill-opacity=".9"/></g>`;
    const drops = [
      [160, 130, 28],
      [290, 560, 40],
      [980, 180, 22],
      [1070, 520, 34],
      [860, 640, 18],
      [180, 380, 14],
      [940, 390, 12],
      [420, 110, 17],
    ]
      .map(([x, y, r]) => drop(x, y, r))
      .join('');
    return doc(
      1200,
      750,
      `${backdrop('jc', 1200, 750, { a: '#1b5f93', b: '#04182c', accent: '#5fc3ee' }, 0.5, 0.35)}
       ${[110, 190, 280, 380].map((r) => `<ellipse cx="600" cy="520" rx="${r * 1.7}" ry="${r * 0.55}" fill="none" stroke="#bfe6ff" stroke-opacity=".25" stroke-width="2"/>`).join('')}
       ${placeWatch('vk-navigator-diver-44', 'jcw', 600, 375, 0.86, 14)}${drops}`
    );
  },
};

/* ---------------- Wide page banners (1600 x 560) ------------------- */
// Watches sit on the right so headlines on the left stay clear.
const banner = (name: string, pal: Palette, a: string, b: string, motif: 'gears' | 'rings'): SceneDef => ({
  name,
  svg: () => {
    const id = name.replace(/[^a-z]/gi, '');
    return doc(
      1600,
      560,
      `${backdrop(id, 1600, 560, pal, 0.74, 0.5)}
       ${motif === 'gears' ? gearCluster(id, 760, 330, 0.9, pal.b, 0.26) : dialRings(1180, 280, 330, pal.accent, 0.35)}
       ${placeWatch(b, `${id}b`, 1390, 300, 0.52, 18)}
       ${placeWatch(a, `${id}a`, 1090, 280, 0.66, -18)}`
    );
  },
});

/* ---------------- Registry ----------------------------------------- */
export const SCENES: SceneDef[] = [
  hero('hero-classic', { a: '#f4ecdb', b: '#cdb98f', accent: '#ffffff' }, 'lines', 'vk-statesman-handwound-38', 'vk-heritage-automatic-39'),
  hero('hero-automatic', { a: '#22252b', b: '#07080a', accent: '#b49a73' }, 'gears', 'vk-sovereign-automatic-40', 'vk-chronos-skeleton-limited-41'),
  hero('hero-minimal', { a: '#f3f2ee', b: '#c9c7c0', accent: '#8a877f' }, 'rings', 'vk-monolith-minimalist-38', 'vk-atlas-slate-36'),
  hero('hero-chronograph', { a: '#1a2c44', b: '#04080f', accent: '#e25b45' }, 'speed', 'vk-aero-chronograph-42', 'vk-obsidian-chronograph-43'),
  hero('hero-signature', { a: '#3a2c18', b: '#0c0905', accent: '#e5c978' }, 'rings', 'vk-regent-moonphase-41', 'vk-aurora-celeste-34'),
  thumb('thumb-classic', { a: '#f6efdf', b: '#cbb68b', accent: '#7c6334' }, 'vk-heritage-automatic-39'),
  thumb('thumb-automatic', { a: '#2a2e36', b: '#08090c', accent: '#b49a73' }, 'vk-sovereign-automatic-40'),
  thumb('thumb-minimal', { a: '#f6f5f2', b: '#c4c2bb', accent: '#77746c' }, 'vk-monolith-minimalist-38'),
  thumb('thumb-chronograph', { a: '#203552', b: '#050a14', accent: '#e25b45' }, 'vk-aero-chronograph-42'),
  thumb('thumb-signature', { a: '#43331b', b: '#0e0a05', accent: '#e5c978' }, 'vk-regent-moonphase-41'),
  duo('men', { a: '#25344d', b: '#070a12', accent: '#8aa8d8' }, 'vk-navigator-diver-44', 'vk-obsidian-chronograph-43', 'gears'),
  duo('women', { a: '#fdeee8', b: '#d9ada0', accent: '#a8705c' }, 'vk-aurora-celeste-34', 'vk-verona-automatic-36', 'rings'),
  duo('unisex', { a: '#dfe4e1', b: '#8f9c97', accent: '#ffffff' }, 'vk-atlas-slate-36', 'vk-halcyon-classic-37', 'rings'),
  duo('occasion-boardroom', { a: '#33363d', b: '#101114', accent: '#c7cbd3' }, 'vk-sovereign-automatic-40', 'vk-statesman-handwound-38', 'rings'),
  duo('occasion-evening', { a: '#2d1b3d', b: '#08040d', accent: '#d9a8e8' }, 'vk-nocturne-noir-34', 'vk-regent-moonphase-41', 'rings'),
  duo('occasion-travel', { a: '#12535c', b: '#04191d', accent: '#63d1dc' }, 'vk-equinox-gmt-40', 'vk-terra-field-40', 'rings'),
  duo('occasion-weekend', { a: '#dfe6cf', b: '#8d9a74', accent: '#ffffff' }, 'vk-terra-field-40', 'vk-atlas-slate-36', 'rings'),
  duo('occasion-celebration', { a: '#f7e9c8', b: '#b99a58', accent: '#ffffff' }, 'vk-solene-gold-28', 'vk-lumiere-diamond-32', 'rings'),
  duo('occasion-sport', { a: '#3b1714', b: '#0c0403', accent: '#ff7a59' }, 'vk-aero-chronograph-42', 'vk-navigator-diver-44', 'gears'),
  coverMovement,
  coverProportion,
  coverSapphire,
  coverLeather,
  coverTravel,
  coverCare,
  banner('banner-men', { a: '#25344d', b: '#070a12', accent: '#8aa8d8' }, 'vk-navigator-diver-44', 'vk-obsidian-chronograph-43', 'gears'),
  banner('banner-women', { a: '#5a2f2a', b: '#1c0d0b', accent: '#f0b7a4' }, 'vk-aurora-celeste-34', 'vk-verona-automatic-36', 'rings'),
  banner('banner-unisex', { a: '#34403c', b: '#0d1210', accent: '#bcd0c6' }, 'vk-atlas-slate-36', 'vk-halcyon-classic-37', 'rings'),
  banner('banner-contact', { a: '#33363d', b: '#101114', accent: '#c7cbd3' }, 'vk-sovereign-automatic-40', 'vk-statesman-handwound-38', 'rings'),
  banner('banner-sizing', { a: '#4a3c26', b: '#151007', accent: '#e5c978' }, 'vk-heritage-automatic-39', 'vk-celeste-rose-30', 'rings'),
  banner('banner-care', { a: '#175077', b: '#04182c', accent: '#5fc3ee' }, 'vk-navigator-diver-44', 'vk-lumiere-diamond-32', 'rings'),
  banner('banner-finder', { a: '#2d1b3d', b: '#08040d', accent: '#d9a8e8' }, 'vk-nocturne-noir-34', 'vk-regent-moonphase-41', 'rings'),
  banner('banner-travel', { a: '#12535c', b: '#04191d', accent: '#63d1dc' }, 'vk-equinox-gmt-40', 'vk-terra-field-40', 'rings'),
  banner('banner-journal', { a: '#262a33', b: '#07080a', accent: '#b49a73' }, 'vk-chronos-skeleton-limited-41', 'vk-sovereign-automatic-40', 'gears'),
];

export { backgroundSvg };
export type { BgName };
