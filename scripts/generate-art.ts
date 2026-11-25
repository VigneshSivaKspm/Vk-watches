/**
 * Writes every static VK TIME artwork file to apps/web/public/images.
 *   npm run art
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { renderWatch, ViewName } from '../apps/web/src/lib/watchArt/engine';
import { CATALOG_DESIGNS, getDesign } from '../apps/web/src/lib/watchArt/designs';
import { SCENES } from '../apps/web/src/lib/watchArt/scenes';

const root = resolve(__dirname, '..', 'apps', 'web', 'public', 'images');
const watchDir = join(root, 'watches');
const sceneDir = join(root, 'scenes');
mkdirSync(watchDir, { recursive: true });
mkdirSync(sceneDir, { recursive: true });

const minify = (svg: string) => svg.replace(/\n\s*/g, ' ').replace(/>\s+</g, '><');

const views: ViewName[] = ['front', 'tilt', 'macro', 'flat'];
let count = 0;

for (const { slug } of CATALOG_DESIGNS) {
  for (const view of views) {
    writeFileSync(join(watchDir, `${slug}-${view}.svg`), minify(renderWatch(getDesign(slug), { view })));
    count++;
  }
  writeFileSync(join(watchDir, `${slug}-alt.svg`), minify(renderWatch(getDesign(slug, true), { view: 'front' })));
  count++;
}

for (const scene of SCENES) {
  writeFileSync(join(sceneDir, `${scene.name}.svg`), minify(scene.svg()));
  count++;
}

console.log(`Generated ${count} artwork files in ${root}`);
