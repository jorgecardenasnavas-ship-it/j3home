import { writeFile, mkdir } from 'fs/promises';
import { dirname } from 'path';

const BASE = 'https://j3padel.com';
const OUT = 'public';

const assets = [
  { url: `${BASE}/images/logo-gold.svg`, path: `${OUT}/images/logo-gold.svg` },
  { url: `${BASE}/images/j3/tecnifibre.png`, path: `${OUT}/images/j3/tecnifibre.png` },
  { url: `${BASE}/images/j3/lacoste.png`, path: `${OUT}/images/j3/lacoste.png` },
  { url: `${BASE}/images/j3/alquilavisual.jpg`, path: `${OUT}/images/j3/alquilavisual.jpg` },
  { url: `${BASE}/images/play_1080.webm`, path: `${OUT}/videos/play_1080.webm` },
];

async function download(asset) {
  try {
    const res = await fetch(asset.url);
    if (!res.ok) throw new Error(`${res.status} ${asset.url}`);
    const buf = Buffer.from(await res.arrayBuffer());
    await mkdir(dirname(asset.path), { recursive: true });
    await writeFile(asset.path, buf);
    console.log(`OK ${asset.path} (${(buf.length / 1024).toFixed(0)}KB)`);
  } catch (e) {
    console.error(`FAIL ${asset.url}: ${e.message}`);
  }
}

// Download 4 at a time
const chunks = [];
for (let i = 0; i < assets.length; i += 4) chunks.push(assets.slice(i, i + 4));
for (const chunk of chunks) await Promise.all(chunk.map(download));
console.log('Done');
