/**
 * Favicon generation script — runs as prebuild/predev hook.
 * Reads src/assets/images/logo.png and writes all favicon formats
 * to src/assets/favicons/. Requires the `sharp` package.
 *
 * Usage: node scripts/generate-favicons.mjs
 */

import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');

const SRC = path.join(root, 'src', 'assets', 'images', 'logo.png');
const DEST = path.join(root, 'public', 'favicons');

if (!fs.existsSync(SRC)) {
  console.warn(
    '[favicons] WARNING: src/assets/images/logo.png not found — skipping favicon generation.\n' +
      '           Place your logo PNG at src/assets/images/logo.png and re-run.'
  );
  process.exit(0);
}

fs.mkdirSync(DEST, { recursive: true });

/**
 * Encode a list of PNG buffers into a .ico binary.
 * ICO spec: https://en.wikipedia.org/wiki/ICO_(file_format)
 */
function buildIco(pngBuffers) {
  const count = pngBuffers.length;
  // Each directory entry is 16 bytes; header is 6 bytes.
  const headerSize = 6 + count * 16;
  let offset = headerSize;

  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type: 1 = ICO
  header.writeUInt16LE(count, 4);

  const entries = [];
  for (const buf of pngBuffers) {
    // Detect actual dimensions from PNG IHDR (bytes 16–24)
    const w = buf.readUInt32BE(16);
    const h = buf.readUInt32BE(20);
    const entry = Buffer.alloc(16);
    entry.writeUInt8(w >= 256 ? 0 : w, 0); // width  (0 = 256)
    entry.writeUInt8(h >= 256 ? 0 : h, 1); // height (0 = 256)
    entry.writeUInt8(0, 2);                 // color count
    entry.writeUInt8(0, 3);                 // reserved
    entry.writeUInt16LE(1, 4);              // color planes
    entry.writeUInt16LE(32, 6);             // bits per pixel
    entry.writeUInt32LE(buf.length, 8);     // size of image data
    entry.writeUInt32LE(offset, 12);        // offset of image data
    offset += buf.length;
    entries.push(entry);
  }

  return Buffer.concat([header, ...entries, ...pngBuffers]);
}

async function run() {
  console.log('[favicons] Generating favicons from', SRC);

  const [png16, png32, png180] = await Promise.all([
    sharp(SRC).resize(16, 16, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toBuffer(),
    sharp(SRC).resize(32, 32, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toBuffer(),
    sharp(SRC).resize(180, 180, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toBuffer(),
  ]);

  // apple-touch-icon.png — 180×180
  const touchIconPath = path.join(DEST, 'apple-touch-icon.png');
  fs.writeFileSync(touchIconPath, png180);
  console.log('[favicons] Written:', path.relative(root, touchIconPath));

  // favicon-32x32.png
  const png32Path = path.join(DEST, 'favicon-32x32.png');
  fs.writeFileSync(png32Path, png32);
  console.log('[favicons] Written:', path.relative(root, png32Path));

  // favicon-16x16.png
  const png16Path = path.join(DEST, 'favicon-16x16.png');
  fs.writeFileSync(png16Path, png16);
  console.log('[favicons] Written:', path.relative(root, png16Path));

  // favicon.ico — contains 16×16 and 32×32
  const icoPath = path.join(DEST, 'favicon.ico');
  fs.writeFileSync(icoPath, buildIco([png16, png32]));
  console.log('[favicons] Written:', path.relative(root, icoPath));

  // favicon.svg — SVG wrapper embedding the 32×32 PNG as a data URI
  const b64 = png32.toString('base64');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <image href="data:image/png;base64,${b64}" width="32" height="32"/>
</svg>`;
  const svgPath = path.join(DEST, 'favicon.svg');
  fs.writeFileSync(svgPath, svg);
  console.log('[favicons] Written:', path.relative(root, svgPath));

  console.log('[favicons] Done.');
}

run().catch((err) => {
  console.error('[favicons] Error:', err.message);
  process.exit(1);
});
