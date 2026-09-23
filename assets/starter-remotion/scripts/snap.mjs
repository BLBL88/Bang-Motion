/* =========================================================
   VERIFIKASI (Remotion) — potret detik kunci → PNG + lembar kontak.
   Padanan scripts/snap.mjs versi HTML: bundle sekali, renderStill per detik.
   BUKAN render penuh; MP4 hanya lewat `npm run render` bila user memintanya.

   Pakai:
     node scripts/snap.mjs                     # Opener, detik 0 2 4 6 …
     COMP=DoorsDemo T="0.5 3 8 16" node scripts/snap.mjs
     SCALE=0.5 node scripts/snap.mjs           # lebih cepat, 960×540
   Hasil: snaps/t<detik>.png + snaps/sheet.png (bila ffmpeg ada)
   ========================================================= */
import { bundle } from '@remotion/bundler';
import { renderStill, selectComposition } from '@remotion/renderer';
import { execFileSync } from 'node:child_process';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';

const COMP = process.env.COMP || 'Opener';
const OUT = process.env.OUT || 'snaps';
const SCALE = Number(process.env.SCALE || 0.5);

await mkdir(OUT, { recursive: true });
const serveUrl = await bundle({ entryPoint: path.resolve('src/index.ts') });
const composition = await selectComposition({ serveUrl, id: COMP });
const { fps, durationInFrames } = composition;
const dur = durationInFrames / fps;
const times = process.env.T
  ? process.env.T.split(/[\s,]+/).filter(Boolean).map(Number)
  : Array.from({ length: Math.min(12, Math.ceil(dur / 2)) }, (_, i) => i * 2);

const files = [];
for (const t of times) {
  const frame = Math.min(durationInFrames - 1, Math.round(t * fps));
  const output = path.join(OUT, `t${t.toFixed(2)}.png`);
  await renderStill({ serveUrl, composition, frame, output, scale: SCALE, chromiumOptions: { gl: 'angle' } });
  files.push(output);
  console.log('snap', t.toFixed(2) + 's', '->', output);
}

// lembar kontak: 3 kolom, butuh ffmpeg (opsional)
try {
  const cols = Math.min(3, files.length);
  const rows = Math.ceil(files.length / cols);
  const inputs = files.flatMap((f) => ['-i', f]);
  const pads = [];
  const cells = files.map((_, i) => `[${i}]scale=640:-1[c${i}]`);
  for (let i = files.length; i < rows * cols; i++) pads.push(`color=black:s=640x${Math.round((640 * composition.height) / composition.width)}[c${i}]`);
  const rowsF = Array.from({ length: rows }, (_, r) =>
    `${Array.from({ length: cols }, (_, c) => `[c${r * cols + c}]`).join('')}hstack=${cols}[r${r}]`);
  const all = rows > 1 ? `${Array.from({ length: rows }, (_, r) => `[r${r}]`).join('')}vstack=${rows}` : '[r0]null';
  execFileSync('ffmpeg', ['-loglevel', 'error', '-y', ...inputs, '-filter_complex',
    [...cells, ...pads, ...rowsF, all].join(';'), '-frames:v', '1', path.join(OUT, 'sheet.png')]);
  console.log('lembar kontak ->', path.join(OUT, 'sheet.png'));
} catch {
  console.log('(ffmpeg tidak ada — lihat PNG satu per satu)');
}
