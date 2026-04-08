#!/usr/bin/env node
/**
 * Remove a near-white background from an image, producing a transparent PNG
 * with soft anti-aliased edges. Uses `sharp` (already a Next.js dep).
 *
 * Usage:
 *   node scripts/remove-bg.mjs --in public/images/story-v2/source/foo.png \
 *                              --out public/images/story-v2/ball.png \
 *                              [--threshold 80] [--feather 30]
 *
 * Algorithm: per-pixel alpha based on euclidean distance from pure white in
 * RGB space. Distances < `feather` are fully transparent, > `threshold` fully
 * opaque, in between linearly interpolated for soft edges.
 */

import sharp from "sharp";
import path from "node:path";
import fs from "node:fs/promises";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

function parseArgs() {
  const out = { in: null, out: null, threshold: 80, feather: 30 };
  const a = process.argv.slice(2);
  for (let i = 0; i < a.length; i++) {
    const k = a[i];
    if (k === "--in") out.in = a[++i];
    else if (k === "--out") out.out = a[++i];
    else if (k === "--threshold") out.threshold = parseInt(a[++i], 10);
    else if (k === "--feather") out.feather = parseInt(a[++i], 10);
  }
  if (!out.in || !out.out) {
    console.error("Usage: node scripts/remove-bg.mjs --in <path> --out <path> [--threshold 80] [--feather 30]");
    process.exit(1);
  }
  return out;
}

async function main() {
  const { in: inPath, out: outPath, threshold, feather } = parseArgs();

  const absIn = path.isAbsolute(inPath) ? inPath : path.join(root, inPath);
  const absOut = path.isAbsolute(outPath) ? outPath : path.join(root, outPath);

  console.log(`> in:        ${path.relative(root, absIn)}`);
  console.log(`  threshold: ${threshold} (fully opaque beyond this distance from white)`);
  console.log(`  feather:   ${feather} (soft edge zone)`);

  // Read into raw RGBA
  const img = sharp(absIn).ensureAlpha();
  const { data, info } = await img.raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;
  if (channels !== 4) throw new Error(`expected 4 channels, got ${channels}`);

  const out = Buffer.alloc(data.length);
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i], g = data[i + 1], b = data[i + 2];
    // Distance from pure white in RGB space
    const dr = 255 - r, dg = 255 - g, db = 255 - b;
    const dist = Math.sqrt(dr * dr + dg * dg + db * db);

    let alpha;
    if (dist <= feather) {
      alpha = 0;
    } else if (dist >= threshold) {
      alpha = 255;
    } else {
      alpha = Math.round(((dist - feather) / (threshold - feather)) * 255);
    }

    out[i] = r;
    out[i + 1] = g;
    out[i + 2] = b;
    out[i + 3] = alpha;
  }

  await fs.mkdir(path.dirname(absOut), { recursive: true });
  await sharp(out, { raw: { width, height, channels: 4 } })
    .png({ compressionLevel: 9 })
    .toFile(absOut);

  console.log(`  saved:     ${path.relative(root, absOut)}`);
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
