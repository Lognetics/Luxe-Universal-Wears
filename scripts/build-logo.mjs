// Produces transparent logo PNGs from the source JPG (white background).
//  - logo-dark.png  : white -> transparent (original dark+cyan marks) for light backgrounds
//  - logo-light.png : white -> transparent, dark -> ivory, cyan kept, for dark backgrounds
// Run: node scripts/build-logo.mjs
import sharp from "sharp";
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const src = path.resolve(root, "..", "Image Folder", "LUXE UNIVERSAL 1.jpg");
const outDir = path.join(root, "public", "brand");
fs.mkdirSync(outDir, { recursive: true });

const WIDTH = 1000;
const IVORY = [246, 241, 233];

const base = sharp(src)
  .flatten({ background: "#ffffff" })
  .trim({ threshold: 12 })
  .resize({ width: WIDTH })
  .ensureAlpha();

const { data, info } = await base.raw().toBuffer({ resolveWithObject: true });
const { width, height, channels } = info;

const dark = Buffer.from(data);
const light = Buffer.from(data);

for (let i = 0; i < data.length; i += channels) {
  const r = data[i], g = data[i + 1], b = data[i + 2];
  const nearWhite = r > 235 && g > 235 && b > 235;
  if (nearWhite) {
    dark[i + 3] = 0;
    light[i + 3] = 0;
    continue;
  }
  // Detect the cyan/blue brand colour (keep it on both versions)
  const isCyan = b > 150 && b > r + 30 && g > r;
  if (!isCyan) {
    // recolour dark elements to ivory for the light/footer version
    light[i] = IVORY[0];
    light[i + 1] = IVORY[1];
    light[i + 2] = IVORY[2];
  }
}

await sharp(dark, { raw: { width, height, channels } }).png().toFile(path.join(outDir, "logo-dark.png"));
await sharp(light, { raw: { width, height, channels } }).png().toFile(path.join(outDir, "logo-light.png"));

// also keep a flat full-colour copy for favicon/social use
await sharp(src).resize({ width: 512 }).png().toFile(path.join(outDir, "logo-square.png"));

console.log(`Logos written to public/brand/ (${width}x${height}).`);
