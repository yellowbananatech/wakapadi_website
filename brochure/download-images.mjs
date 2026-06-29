import { mkdir, writeFile, access } from 'fs/promises';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const imagesDir = join(__dirname, 'images');

const PEXELS = (id) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=1600`;
const UNSPLASH = (id) => `https://images.unsplash.com/photo-${id}?w=1600&q=85`;

/** Stock images — replace files in brochure/images/ manually to swap photos. */
const IMAGES = {
  cover: PEXELS(3601425),
  letter: PEXELS(1032650),
  glance: PEXELS(1450360),
  stoneTown: PEXELS(457881),
  womanBeach: UNSPLASH('1507525428034-b723cf961d3e'),
  dhow: PEXELS(1450353),
  villa: UNSPLASH('1571896349842-33c89424de2d'),
  villaInterior: UNSPLASH('1613490493576-7fde63acd811'),
  hotel: UNSPLASH('1566073771259-6a8506099945'),
  hotelBreakfast: UNSPLASH('1551882547-ff40c63fe5fa'),
  conference: UNSPLASH('1529156069898-49953e39b3ac'),
  sunset: PEXELS(248797),
  dinner: PEXELS(941861),
  snorkel: PEXELS(3764011),
  kayak: PEXELS(442584),
  turtle: PEXELS(847393),
  group: UNSPLASH('1529156069898-49953e39b3ac'),
  departure: UNSPLASH('1436491865332-7a61a109cc05'),
  aspirational: PEXELS(1450363),
  beachDusk: PEXELS(248797),
};

/** Never overwrite — add manually or via image generation. */
const SKIP_IF_EXISTS = new Set(['nigerian-women-group.jpg']);

async function fileExists(path) {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

async function download(name, url) {
  const path = join(imagesDir, `${name}.jpg`);
  if (SKIP_IF_EXISTS.has(`${name}.jpg`) && (await fileExists(path))) {
    console.log(`Skipped ${name} (already present)`);
    return `${name}.jpg`;
  }
  const res = await fetch(url, { redirect: 'follow' });
  if (!res.ok) throw new Error(`Failed to download ${name}: ${res.status} ${url}`);
  const buf = Buffer.from(await res.arrayBuffer());
  await writeFile(path, buf);
  return `${name}.jpg`;
}

await mkdir(imagesDir, { recursive: true });
const files = {};
for (const [name, url] of Object.entries(IMAGES)) {
  files[name] = await download(name, url);
  console.log(`Ready ${name}`);
}
await writeFile(join(__dirname, 'image-manifest.json'), JSON.stringify(files, null, 2));
console.log('Stock images ready. Replace any file in brochure/images/ to swap photos.');
