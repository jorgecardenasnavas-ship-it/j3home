#!/usr/bin/env node
/**
 * Generate images via fal.ai nano-banana, or Pollinations (free).
 *
 * Usage:
 *   node scripts/gen-image.mjs --prompt "..." --out story-v2/hero.jpg
 *   node scripts/gen-image.mjs --prompt "..." --out story-v2/hero.jpg --provider pollinations
 *   node scripts/gen-image.mjs --prompt "..." --out story-v2/hero.jpg --ref public/images/base.jpg
 *
 * Default provider: pollinations (free, no key). Set --provider fal to use fal.ai (needs FAL_KEY).
 * Pollinations supports --w and --h (default 1920x1080). Output saved under public/images/<out>.
 */

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

async function loadEnv() {
  try {
    const raw = await fs.readFile(path.join(root, ".env.local"), "utf8");
    for (const line of raw.split(/\r?\n/)) {
      const m = line.match(/^([A-Z0-9_]+)\s*=\s*(.*)$/);
      if (m && !process.env[m[1]]) process.env[m[1]] = m[2].trim();
    }
  } catch {}
}

function parseArgs() {
  const out = {
    prompt: null,
    out: null,
    ref: null,
    model: "fal-ai/nano-banana",
    provider: "pollinations",
    w: 1920,
    h: 1080,
    seed: null,
  };
  const a = process.argv.slice(2);
  for (let i = 0; i < a.length; i++) {
    const k = a[i];
    if (k === "--prompt") out.prompt = a[++i];
    else if (k === "--out") out.out = a[++i];
    else if (k === "--ref") out.ref = a[++i];
    else if (k === "--model") out.model = a[++i];
    else if (k === "--provider") out.provider = a[++i];
    else if (k === "--w") out.w = parseInt(a[++i], 10);
    else if (k === "--h") out.h = parseInt(a[++i], 10);
    else if (k === "--seed") out.seed = a[++i];
  }
  if (!out.prompt || !out.out) {
    console.error("Usage: node scripts/gen-image.mjs --prompt \"...\" --out story-v2/hero.jpg [--provider pollinations|fal] [--w 1920 --h 1080]");
    process.exit(1);
  }
  return out;
}

async function callFal(model, body, key) {
  // Use synchronous run endpoint — blocks until result is ready.
  const url = `https://fal.run/${model}`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Authorization": `Key ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`fal.ai ${res.status}: ${text}`);
  }
  return res.json();
}

async function downloadTo(url, dest) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`download ${res.status}: ${url}`);
  const buf = Buffer.from(await res.arrayBuffer());
  await fs.mkdir(path.dirname(dest), { recursive: true });
  await fs.writeFile(dest, buf);
  return dest;
}

async function pollinations({ prompt, w, h, seed }) {
  // Pollinations: free, no key. Uses Flux by default. URL-encoded prompt.
  // nologo=true removes watermark; private=true skips public feed.
  const params = new URLSearchParams({
    width: String(w),
    height: String(h),
    nologo: "true",
    enhance: "true",
    private: "true",
    model: "flux",
  });
  if (seed) params.set("seed", String(seed));
  const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?${params}`;
  return url;
}

async function main() {
  await loadEnv();
  const args = parseArgs();
  const { prompt, out, ref, model, provider, w, h, seed } = args;

  const dest = path.join(root, "public", "images", out);

  console.log(`> provider: ${provider}`);
  console.log(`  prompt:   ${prompt.slice(0, 90)}${prompt.length > 90 ? "..." : ""}`);
  if (ref) console.log(`  ref:      ${ref}`);

  if (provider === "pollinations") {
    const url = await pollinations({ prompt, w, h, seed });
    await downloadTo(url, dest);
    console.log(`  saved:    public/images/${out}`);
    return;
  }

  if (provider === "fal") {
    const key = process.env.FAL_KEY;
    if (!key) throw new Error("FAL_KEY missing in .env.local");
    const body = { prompt };
    if (ref) {
      const refAbs = path.isAbsolute(ref) ? ref : path.join(root, ref);
      const buf = await fs.readFile(refAbs);
      const ext = path.extname(refAbs).slice(1) || "jpg";
      const mime = ext === "png" ? "image/png" : "image/jpeg";
      const dataUrl = `data:${mime};base64,${buf.toString("base64")}`;
      body.image_urls = [dataUrl];
    }
    const result = await callFal(model, body, key);
    const imgUrl = result?.images?.[0]?.url;
    if (!imgUrl) {
      console.error("No image in response:", JSON.stringify(result).slice(0, 400));
      process.exit(1);
    }
    await downloadTo(imgUrl, dest);
    console.log(`  saved:    public/images/${out}`);
    return;
  }

  throw new Error(`Unknown provider: ${provider}`);
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
