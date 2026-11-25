/**
 * VK TIME catalogue extensions + local artwork mapping.
 * Artwork lives in apps/web/public/images (regenerate with `npm run art`).
 */

export const watchImage = (slug: string, view: 'front' | 'tilt' | 'macro' | 'flat' | 'alt') =>
  `/images/watches/${slug}-${view}.svg`;

export const sceneImage = (name: string) => `/images/scenes/${name}.svg`;

export const collectionArtwork = (slug: string) => {
  const key = slug.replace(/^the-/, '').replace(/-collection$/, '');
  return { heroImage: sceneImage(`hero-${key}`), thumbnailImage: sceneImage(`thumb-${key}`) };
};

export const journalArtwork: Record<string, string> = {
  'the-anatomy-of-a-mechanical-movement': sceneImage('journal-movement'),
  'finding-your-ideal-wrist-proportions': sceneImage('journal-proportion'),
  'the-art-of-sapphire-crystals': sceneImage('journal-sapphire'),
  'the-quiet-luxury-of-a-leather-strap': sceneImage('journal-leather'),
  'travelling-across-time-zones-with-a-gmt': sceneImage('journal-travel'),
  'caring-for-your-watch-through-the-seasons': sceneImage('journal-care'),
};

/** Second colourway for references that originally shipped with a single variant. */
const ALT_VARIANTS: Record<string, { dialColour: string; strapColour: string; strapMaterial: string }> = {
  'vk-monolith-minimalist-38': { dialColour: 'Graphite Charcoal', strapColour: 'Gunmetal', strapMaterial: 'Milanese Mesh' },
  'vk-aero-chronograph-42': { dialColour: 'Reverse Panda Black', strapColour: 'Brushed Silver', strapMaterial: 'Solid Stainless Steel Link' },
  'vk-aurora-celeste-34': { dialColour: 'Blue Mother-of-Pearl', strapColour: 'Midnight Navy', strapMaterial: 'Full-Grain Italian Leather' },
  'vk-chronos-skeleton-limited-41': { dialColour: 'Rose Gold Skeleton', strapColour: 'Cognac Brown', strapMaterial: 'Alligator-Embossed Leather' },
  'vk-heritage-automatic-39': { dialColour: 'Royal Navy Sector', strapColour: 'Dark Havana', strapMaterial: 'Full-Grain Italian Leather' },
};

/** Replaces every image reference on a product with its own VK artwork. */
export function withArtwork<T extends { slug: string; price: number; compareAtPrice?: number; variants: any[] }>(p: T) {
  const variants = p.variants.map((v, i) => ({
    ...v,
    imageUrls: JSON.stringify([watchImage(p.slug, i === 0 ? 'front' : 'alt')]),
  }));

  const alt = ALT_VARIANTS[p.slug];
  if (alt && variants.length === 1) {
    variants.push({
      ...alt,
      sku: variants[0].sku.replace(/\d{3}$/, '002'),
      price: p.price,
      compareAtPrice: p.compareAtPrice,
      stock: 6,
      imageUrls: JSON.stringify([watchImage(p.slug, 'alt')]),
    });
  }

  return {
    ...p,
    primaryImage: watchImage(p.slug, 'front'),
    secondaryImage: watchImage(p.slug, 'tilt'),
    galleryImages: JSON.stringify(
      (['front', 'tilt', 'macro', 'flat'] as const).map((v) => watchImage(p.slug, v))
    ),
    variants,
  };
}

/* ------------------------------------------------------------------ */
/*  Additional references                                              */
/* ------------------------------------------------------------------ */

type Movement = 'Automatic' | 'Mechanical' | 'Quartz' | 'Chronograph';

interface Compact {
  slug: string;
  title: string;
  subtitle: string;
  short: string;
  story: string;
  collection: 'classic' | 'automatic' | 'minimal' | 'chronograph' | 'signature';
  gender: 'Men' | 'Women' | 'Unisex';
  movement: Movement;
  diameter: number;
  thickness: number;
  price: number;
  compareAt?: number;
  flags: Array<'featured' | 'new' | 'bestseller' | 'limited'>;
  editionLimit?: number;
  stock: number;
  code: string;
  caseMaterial: string;
  caseColour: string;
  bezel: string;
  dialColour: string;
  dialFinish: string;
  markers: string;
  hands: string;
  strapMaterial: string;
  strapColour: string;
  altDial: string;
  altStrapMaterial: string;
  altStrapColour: string;
  date?: boolean;
  subDials?: number;
  waterAtm: number;
}

const MOVEMENTS: Record<Movement, { maker: string; calibre: string; power: string; reserve: string; accuracy: string; freq: string; jewels: number }> = {
  Automatic: { maker: 'VK Atelier Horloger', calibre: 'Calibre VK-805 Automatic', power: 'Self-winding kinetic rotor', reserve: '42 Hours', accuracy: '-4 to +6 seconds / day', freq: '28,800 vph (4 Hz)', jewels: 26 },
  Mechanical: { maker: 'VK Atelier Horloger', calibre: 'Calibre VK-720 Hand-Wound', power: 'Manual crown winding', reserve: '48 Hours', accuracy: '-5 to +8 seconds / day', freq: '21,600 vph (3 Hz)', jewels: 19 },
  Quartz: { maker: 'Ronda Horology Swiss', calibre: 'Ronda 763 Precision Quartz', power: 'Swiss silver-oxide battery', reserve: '48 Months', accuracy: '±10 seconds / month', freq: '32,768 Hz', jewels: 5 },
  Chronograph: { maker: 'Seiko Instruments', calibre: 'VK64 Meca-Quartz Chronograph', power: 'Battery with mechanical chronograph module', reserve: '36 Months', accuracy: '±15 seconds / month', freq: '32,768 Hz', jewels: 4 },
};

const compact: Compact[] = [
  {
    slug: 'vk-regent-moonphase-41', title: 'VK Regent Moonphase 41', subtitle: 'Midnight Sunburst | Moonphase | Gold Case',
    short: '41mm automatic moonphase in warm gold with a midnight sunburst dial.',
    story: 'A celestial complication framed in champagne gold. The Regent traces the lunar cycle across a deep midnight dial, its faceted dauphine hands catching light with every turn of the wrist.',
    collection: 'signature', gender: 'Men', movement: 'Automatic', diameter: 41, thickness: 11.2, price: 76500, compareAt: 84000, flags: ['featured', 'limited'], editionLimit: 150, stock: 9, code: 'REG',
    caseMaterial: 'Rose Gold PVD', caseColour: 'Champagne Gold', bezel: 'Polished Gold PVD', dialColour: 'Midnight Blue', dialFinish: 'Sunburst Brushed', markers: 'Applied gold batons', hands: 'Faceted dauphine', strapMaterial: 'Alligator-Embossed Leather', strapColour: 'Dark Havana',
    altDial: 'Champagne Ivory', altStrapMaterial: 'Alligator-Embossed Leather', altStrapColour: 'Cognac', subDials: 1, waterAtm: 5,
  },
  {
    slug: 'vk-navigator-diver-44', title: 'VK Navigator Diver 44', subtitle: '300m | Ceramic Bezel | Ocean Blue',
    short: '44mm professional diver with ceramic bezel and 300m water resistance.',
    story: 'Built for pressure. A unidirectional ceramic bezel, oversized luminous markers and a screw-down crown make the Navigator a dependable companion from reef to boardroom.',
    collection: 'automatic', gender: 'Men', movement: 'Automatic', diameter: 44, thickness: 13.4, price: 58900, compareAt: 65000, flags: ['featured', 'bestseller'], stock: 22, code: 'NAV',
    caseMaterial: '316L Stainless Steel', caseColour: 'Brushed Steel', bezel: 'Unidirectional Blue Ceramic', dialColour: 'Ocean Blue', dialFinish: 'Sunburst Brushed', markers: 'Luminous round indices', hands: 'Luminous sword', strapMaterial: 'Solid Stainless Steel Link', strapColour: 'Brushed Silver',
    altDial: 'Abyss Black', altStrapMaterial: 'Silicone Sport', altStrapColour: 'Black', date: true, waterAtm: 30,
  },
  {
    slug: 'vk-obsidian-chronograph-43', title: 'VK Obsidian Chronograph 43', subtitle: 'All-Black PVD | Tri-Compax | Red Accents',
    short: '43mm stealth-black chronograph with tri-compax registers.',
    story: 'A study in black. Matte surfaces absorb the light while crimson chronograph hands cut through with absolute legibility.',
    collection: 'chronograph', gender: 'Men', movement: 'Chronograph', diameter: 43, thickness: 12.6, price: 42900, compareAt: 48000, flags: ['featured', 'new'], stock: 16, code: 'OBS',
    caseMaterial: 'Ceramic', caseColour: 'Matte Black PVD', bezel: 'Black Ceramic', dialColour: 'Matte Obsidian', dialFinish: 'Matte Velveteen', markers: 'Applied batons', hands: 'Luminous batons', strapMaterial: 'Silicone Sport', strapColour: 'Black',
    altDial: 'Racing Blue', altStrapMaterial: 'Full-Grain Italian Leather', altStrapColour: 'Navy', subDials: 3, waterAtm: 10,
  },
  {
    slug: 'vk-terra-field-40', title: 'VK Terra Field 40', subtitle: 'Titanium | Forest Dial | Field Numerals',
    short: '40mm lightweight titanium field watch with high-contrast numerals.',
    story: 'Rugged restraint. Grade 5 titanium, a forest-green dial and bold numerals recall the instruments of early expedition teams.',
    collection: 'classic', gender: 'Men', movement: 'Automatic', diameter: 40, thickness: 11.0, price: 36500, flags: ['new'], stock: 30, code: 'TER',
    caseMaterial: 'Titanium Grade 5', caseColour: 'Bead-Blasted Titanium', bezel: 'Brushed Titanium', dialColour: 'Forest Green', dialFinish: 'Matte Velveteen', markers: 'Printed Arabic numerals', hands: 'Luminous batons', strapMaterial: 'Suede Calfskin', strapColour: 'Field Tan',
    altDial: 'Desert Sand', altStrapMaterial: 'Suede Calfskin', altStrapColour: 'Olive', date: true, waterAtm: 10,
  },
  {
    slug: 'vk-statesman-handwound-38', title: 'VK Statesman Hand-Wound 38', subtitle: 'Roman Enamel Dial | Small Seconds | Gold',
    short: '38mm hand-wound dress watch with Roman numerals and small seconds.',
    story: 'The ceremony of winding, preserved. A fluted gold bezel surrounds a cream enamel-style dial with blued leaf hands.',
    collection: 'classic', gender: 'Men', movement: 'Mechanical', diameter: 38, thickness: 8.9, price: 52000, compareAt: 58500, flags: ['bestseller'], stock: 12, code: 'STA',
    caseMaterial: 'Rose Gold PVD', caseColour: 'Yellow Gold', bezel: 'Fluted Gold PVD', dialColour: 'Cream Enamel', dialFinish: 'Enamel Lacquer', markers: 'Roman numerals', hands: 'Blued leaf', strapMaterial: 'Alligator-Embossed Leather', strapColour: 'Mahogany',
    altDial: 'Onyx', altStrapMaterial: 'Alligator-Embossed Leather', altStrapColour: 'Black', subDials: 1, waterAtm: 3,
  },
  {
    slug: 'vk-celeste-rose-30', title: 'VK Céleste Rose 30', subtitle: 'Blush Sunburst | Rose Gold Mesh | 30mm',
    short: '30mm rose-gold watch with blush dial and fluid Milanese mesh.',
    story: 'Soft light, set in rose gold. The blush sunburst dial shifts tone through the day, held by a supple woven mesh bracelet.',
    collection: 'minimal', gender: 'Women', movement: 'Quartz', diameter: 30, thickness: 6.9, price: 21500, compareAt: 25000, flags: ['featured', 'bestseller'], stock: 34, code: 'CEL',
    caseMaterial: 'Rose Gold PVD', caseColour: 'Rose Gold', bezel: 'Polished Rose Gold', dialColour: 'Blush Pink', dialFinish: 'Sunburst Brushed', markers: 'Slim applied batons', hands: 'Rose gold batons', strapMaterial: 'Milanese Mesh', strapColour: 'Rose Gold',
    altDial: 'Warm White', altStrapMaterial: 'Milanese Mesh', altStrapColour: 'Silver', waterAtm: 3,
  },
  {
    slug: 'vk-lumiere-diamond-32', title: 'VK Lumière Diamond 32', subtitle: 'Mother-of-Pearl | Stone-Set Bezel | Steel',
    short: '32mm stone-set bezel with mother-of-pearl dial on a steel bracelet.',
    story: 'Forty-eight faceted stones frame a luminous pearl dial. Lumière was drawn for evenings that deserve to be remembered.',
    collection: 'signature', gender: 'Women', movement: 'Quartz', diameter: 32, thickness: 7.4, price: 46800, compareAt: 52000, flags: ['new', 'featured'], stock: 11, code: 'LUM',
    caseMaterial: '316L Stainless Steel', caseColour: 'Polished Steel', bezel: 'Stone-Set Steel (48 crystals)', dialColour: 'White Mother-of-Pearl', dialFinish: 'Aventurine Textured', markers: 'Roman numerals', hands: 'Polished leaf', strapMaterial: 'Solid Stainless Steel Link', strapColour: 'Polished Silver',
    altDial: 'Rose Pearl', altStrapMaterial: 'Solid Stainless Steel Link', altStrapColour: 'Rose Gold', waterAtm: 3,
  },
  {
    slug: 'vk-solene-gold-28', title: 'VK Solène Gold 28', subtitle: 'Champagne Dial | Jewellery Bracelet | 28mm',
    short: '28mm jewellery watch in champagne gold with matching bracelet.',
    story: 'Petite, precise and radiant. Solène wears like a bracelet and keeps time like an instrument.',
    collection: 'classic', gender: 'Women', movement: 'Quartz', diameter: 28, thickness: 6.5, price: 27900, flags: ['bestseller'], stock: 19, code: 'SOL',
    caseMaterial: 'Rose Gold PVD', caseColour: 'Yellow Gold', bezel: 'Fluted Gold PVD', dialColour: 'Champagne', dialFinish: 'Sunburst Brushed', markers: 'Dagger indices', hands: 'Dauphine', strapMaterial: 'Solid Stainless Steel Link', strapColour: 'Yellow Gold',
    altDial: 'Ice Silver', altStrapMaterial: 'Solid Stainless Steel Link', altStrapColour: 'Silver', waterAtm: 3,
  },
  {
    slug: 'vk-verona-automatic-36', title: 'VK Verona Automatic 36', subtitle: 'Emerald Guilloché | Rose Gold | Automatic',
    short: '36mm automatic with emerald guilloché dial and rose-gold case.',
    story: 'Concentric guilloché ripples across a deep emerald dial, powered by a self-winding calibre visible through the caseback.',
    collection: 'automatic', gender: 'Women', movement: 'Automatic', diameter: 36, thickness: 9.6, price: 49500, compareAt: 55000, flags: ['featured', 'new', 'limited'], editionLimit: 200, stock: 8, code: 'VER',
    caseMaterial: 'Rose Gold PVD', caseColour: 'Rose Gold', bezel: 'Polished Rose Gold', dialColour: 'Emerald Green', dialFinish: 'Guilloché', markers: 'Applied batons', hands: 'Dauphine', strapMaterial: 'Suede Calfskin', strapColour: 'Emerald',
    altDial: 'Bordeaux', altStrapMaterial: 'Suede Calfskin', altStrapColour: 'Wine', waterAtm: 5,
  },
  {
    slug: 'vk-nocturne-noir-34', title: 'VK Nocturne Noir 34', subtitle: 'Black Sunburst | Stone-Set | Gold',
    short: '34mm evening watch with black sunburst dial and stone-set gold bezel.',
    story: 'Made for after dark: a black radiating dial, golden points of light and a bezel that glitters quietly.',
    collection: 'minimal', gender: 'Women', movement: 'Quartz', diameter: 34, thickness: 7.1, price: 34500, flags: ['new'], stock: 21, code: 'NOC',
    caseMaterial: 'Rose Gold PVD', caseColour: 'Yellow Gold', bezel: 'Stone-Set Gold PVD', dialColour: 'Black Sunburst', dialFinish: 'Sunburst Brushed', markers: 'Gold dot indices', hands: 'Leaf', strapMaterial: 'Suede Calfskin', strapColour: 'Black',
    altDial: 'Midnight Blue', altStrapMaterial: 'Suede Calfskin', altStrapColour: 'Navy', waterAtm: 3,
  },
  {
    slug: 'vk-equinox-gmt-40', title: 'VK Equinox GMT 40', subtitle: 'Dual Time | Teal Dial | Crimson Bezel',
    short: '40mm automatic GMT tracking two time zones at a glance.',
    story: 'For the perpetually in transit. A fourth hand sweeps the 24-hour scale, keeping home within sight wherever you land.',
    collection: 'automatic', gender: 'Unisex', movement: 'Automatic', diameter: 40, thickness: 12.1, price: 64000, compareAt: 71000, flags: ['featured', 'new'], stock: 15, code: 'EQX',
    caseMaterial: '904L Oystersteel', caseColour: 'Polished & Brushed Steel', bezel: 'Crimson Ceramic', dialColour: 'Deep Teal', dialFinish: 'Sunburst Brushed', markers: 'Luminous round indices', hands: 'Sword with orange GMT', strapMaterial: 'Solid Stainless Steel Link', strapColour: 'Brushed Silver',
    altDial: 'Carbon Black', altStrapMaterial: 'Solid Stainless Steel Link', altStrapColour: 'Brushed Silver', date: true, waterAtm: 20,
  },
  {
    slug: 'vk-atlas-slate-36', title: 'VK Atlas Slate 36', subtitle: 'Titanium | Slate Dial | Everyday',
    short: '36mm featherweight titanium everyday watch.',
    story: 'Quiet architecture in titanium and slate. Atlas disappears on the wrist and appears exactly when you need it.',
    collection: 'minimal', gender: 'Unisex', movement: 'Quartz', diameter: 36, thickness: 7.0, price: 18900, compareAt: 22000, flags: ['bestseller'], stock: 40, code: 'ATL',
    caseMaterial: 'Titanium Grade 5', caseColour: 'Satin Titanium', bezel: 'Brushed Titanium', dialColour: 'Slate Grey', dialFinish: 'Matte Velveteen', markers: 'Printed batons', hands: 'Batons', strapMaterial: 'Full-Grain Italian Leather', strapColour: 'Stone Grey',
    altDial: 'Sandstone', altStrapMaterial: 'Full-Grain Italian Leather', altStrapColour: 'Saddle', waterAtm: 5,
  },
  {
    slug: 'vk-halcyon-classic-37', title: 'VK Halcyon Classic 37', subtitle: 'Rose Gold | Ivory Numerals | Hand-Wound',
    short: '37mm hand-wound classic with ivory dial in rose gold.',
    story: 'A gentle, mid-century silhouette with warm numerals and a hand-wound heart that rewards daily ritual.',
    collection: 'classic', gender: 'Unisex', movement: 'Mechanical', diameter: 37, thickness: 8.6, price: 39800, flags: [], stock: 17, code: 'HAL',
    caseMaterial: 'Rose Gold PVD', caseColour: 'Rose Gold', bezel: 'Polished Rose Gold', dialColour: 'Ivory', dialFinish: 'Enamel Lacquer', markers: 'Arabic numerals', hands: 'Lance', strapMaterial: 'Full-Grain Italian Leather', strapColour: 'Honey Tan',
    altDial: 'British Green', altStrapMaterial: 'Full-Grain Italian Leather', altStrapColour: 'Dark Brown', waterAtm: 3,
  },
];

const buildProduct = (c: Compact) => {
  const m = MOVEMENTS[c.movement];
  const sku = `VKT-${c.code}-${c.diameter}`;
  const variant = (n: 1 | 2, dialColour: string, strapMaterial: string, strapColour: string) => ({
    sku: `${sku}-00${n}`,
    dialColour,
    strapColour,
    strapMaterial,
    price: c.price,
    compareAtPrice: c.compareAt,
    stock: Math.max(2, Math.floor(c.stock / 2)),
    imageUrls: '[]',
  });

  return {
    slug: c.slug,
    title: c.title,
    subtitle: c.subtitle,
    description: `${c.story} Finished by hand and protected by an anti-reflective sapphire crystal, it is covered by the VK TIME international warranty.`,
    shortDescription: c.short,
    collectionSlug: `the-${c.collection}-collection`,
    gender: c.gender,
    movementType: c.movement,
    caseDiameterMm: c.diameter,
    price: c.price,
    compareAtPrice: c.compareAt,
    currency: 'INR',
    isFeatured: c.flags.includes('featured'),
    isNewArrival: c.flags.includes('new'),
    isBestseller: c.flags.includes('bestseller'),
    isLimitedEdition: c.flags.includes('limited'),
    editionLimit: c.editionLimit,
    stock: c.stock,
    primaryImage: '',
    secondaryImage: '',
    galleryImages: '[]',
    specifications: {
      brand: 'VK TIME',
      modelName: c.title.replace(/^VK /, '').replace(/ \d+$/, ''),
      modelNumber: sku,
      sku: `${sku}-001`,
      countryOfOrigin: 'Switzerland / Assembled India',
      movementType: c.movement,
      movementManufacturer: m.maker,
      calibre: m.calibre,
      powerSource: m.power,
      powerReserve: m.reserve,
      accuracy: m.accuracy,
      frequency: m.freq,
      jewelCount: m.jewels,
      caseMaterial: c.caseMaterial,
      caseDiameterMm: c.diameter,
      caseThicknessMm: c.thickness,
      caseShape: 'Round',
      caseColour: c.caseColour,
      caseFinish: 'Alternating brushed and mirror-polished surfaces',
      bezelMaterial: c.bezel,
      caseBackType: c.waterAtm >= 10 ? 'Solid Engraved Screwed' : 'Exhibition Sapphire with engraved brand serial',
      crownType: c.waterAtm >= 10 ? 'Screw-down with Embossed VK Logo' : 'Push/Pull Fluted',
      lugToLugMm: Math.round(c.diameter * 1.17 * 10) / 10,
      dialColour: c.dialColour,
      dialFinish: c.dialFinish,
      displayType: c.movement === 'Chronograph' ? 'Analog Chronograph' : c.code === 'EQX' ? 'Dual Time' : 'Analog 3-Hand',
      hourMarkers: c.markers,
      handMaterial: c.hands,
      luminousIndicators: c.waterAtm >= 10 ? 'Super-LumiNova BGW9' : 'Subtle lume pips',
      dateDisplay: !!c.date,
      dayDisplay: false,
      subDials: c.subDials ?? 0,
      crystalMaterial: 'Sapphire Crystal (Anti-Reflective)',
      antiReflectiveCoating: true,
      strapMaterial: c.strapMaterial,
      strapColour: c.strapColour,
      strapWidthMm: c.diameter >= 40 ? 22 : c.diameter >= 35 ? 20 : 14,
      lugWidthMm: c.diameter >= 40 ? 22 : c.diameter >= 35 ? 20 : 14,
      braceletConstruction: 'Quick-release interchangeable construction',
      claspType: c.strapMaterial.includes('Steel') ? 'Folding Safety Clasp' : 'Pin Buckle',
      interchangeableStrap: true,
      waterResistanceAtm: c.waterAtm,
      waterResistanceMeters: c.waterAtm * 10,
      shockResistance: true,
      magneticResistance: '4,800 A/m',
      productWeightGrams: Math.round(c.diameter * (c.strapMaterial.includes('Steel') ? 3.4 : 1.8)),
      wristSizeMinMm: c.diameter >= 40 ? 160 : c.diameter >= 35 ? 145 : 130,
      wristSizeMaxMm: c.diameter >= 40 ? 220 : c.diameter >= 35 ? 205 : 185,
      warrantyYears: 5,
      packageContents: JSON.stringify([
        `${c.title} Timepiece`,
        'VK TIME Presentation Box',
        'Certificate of Authenticity',
        '5-Year International Warranty Booklet',
      ]),
      careInstructions: 'Wipe with a soft microfibre cloth. Check seals every 24 months.',
    },
    variants: [
      variant(1, c.dialColour, c.strapMaterial, c.strapColour),
      variant(2, c.altDial, c.altStrapMaterial, c.altStrapColour),
    ],
  };
};

export const extraProducts = compact.map(buildProduct);

export const extraJournal = [
  {
    slug: 'the-quiet-luxury-of-a-leather-strap',
    title: 'The Quiet Luxury of a Well-Worn Leather Strap',
    excerpt: 'Full-grain hides, saddle stitching and the slow patina that makes every strap singular.',
    content: `A leather strap is the only part of a watch that remembers its owner. Over months it softens, darkens and moulds itself to the exact contour of a wrist.

VK TIME straps begin as full-grain hides, tanned slowly with vegetable extracts. The grain is left uncorrected, so the natural pores remain visible and the material is free to breathe.

To keep a strap at its best, let it rest for a day between wears, keep it away from direct water, and condition it sparingly twice a year. Quick-release spring bars make rotating between two straps a matter of seconds.`,
    author: 'Meera Nair, Leather Atelier',
    readingTimeMinutes: 4,
    category: 'Craftsmanship',
    coverImage: '',
    tags: JSON.stringify(['Leather', 'Straps', 'Care']),
  },
  {
    slug: 'travelling-across-time-zones-with-a-gmt',
    title: 'Two Places at Once: Travelling Across Time Zones with a GMT',
    excerpt: 'How a fourth hand and a 24-hour bezel keep home within sight, wherever you land.',
    content: `The GMT complication was born with long-haul aviation, when crews needed to read two time zones without arithmetic.

Set the arrow-tipped hand to your home time against the 24-hour scale. On arrival, adjust the local hour and minute hands. Day and night at home remain readable at a glance, which is the difference between a thoughtful call and a very early one.

The two-tone ceramic bezel of the Equinox is resistant to scratches and ultraviolet fading, so it will look the same after a decade of departures.`,
    author: 'Capt. Arjun Rao (Retd.)',
    readingTimeMinutes: 5,
    category: 'Horology',
    coverImage: '',
    tags: JSON.stringify(['GMT', 'Travel', 'Complications']),
  },
  {
    slug: 'caring-for-your-watch-through-the-seasons',
    title: 'Water, Heat and Humidity: Caring for Your Watch Through the Seasons',
    excerpt: 'A practical guide to protecting seals, straps and movements from monsoon to summer.',
    content: `Water resistance is not permanent. Gaskets age with heat, perfume, salt and time, which is why we recommend a pressure test every two years.

Never operate the crown or chronograph pushers while submerged, and always screw the crown down fully before swimming. After the sea, rinse the case with fresh water and dry it with a soft cloth.

In humid months, avoid leaving watches in closed leather boxes without airflow. Automatic watches benefit from being worn or wound at least once every few weeks to keep lubricants evenly distributed.`,
    author: 'Elena Rossi, Materials Specialist',
    readingTimeMinutes: 4,
    category: 'Style Guide',
    coverImage: '',
    tags: JSON.stringify(['Care', 'Water Resistance', 'Service']),
  },
];
