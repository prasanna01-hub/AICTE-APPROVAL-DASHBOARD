/**
 * Generates the PWA app icons (PNG) without any external image dependency.
 * Draws the AICTE shield logo on a full-bleed blue gradient (maskable-safe).
 *
 * Usage: node scripts/gen-icons.mjs
 */
import { deflateSync } from 'node:zlib';
import { mkdirSync, writeFileSync } from 'node:fs';

const CRC_TABLE = (() => {
  const table = new Int32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    table[n] = c;
  }
  return table;
})();

function crc32(buf) {
  let c = -1;
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ -1) >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const typeBuf = Buffer.from(type, 'ascii');
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])), 0);
  return Buffer.concat([len, typeBuf, data, crcBuf]);
}

function encodePng(width, height, rgba) {
  const sig = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // RGBA
  const raw = Buffer.alloc((width * 4 + 1) * height);
  for (let y = 0; y < height; y++) {
    raw[y * (width * 4 + 1)] = 0;
    rgba.copy(raw, y * (width * 4 + 1) + 1, y * width * 4, (y + 1) * width * 4);
  }
  return Buffer.concat([
    sig,
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

const clamp01 = (v) => Math.min(1, Math.max(0, v));
const mix = (a, b, t) => a + (b - a) * clamp01(t);

function distToSegment(px, py, x1, y1, x2, y2) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const lenSq = dx * dx + dy * dy;
  let t = lenSq === 0 ? 0 : ((px - x1) * dx + (py - y1) * dy) / lenSq;
  t = clamp01(t);
  const cx = x1 + t * dx;
  const cy = y1 + t * dy;
  return Math.hypot(px - cx, py - cy);
}

function renderIcon(size) {
  const rgba = Buffer.alloc(size * size * 4);
  const ss = 3; // supersampling factor
  const shieldTop = 0.19;
  const shieldBottom = 0.83;
  const halfWidth = 0.255;

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      let r = 0, g = 0, b = 0, a = 0;

      for (let sy = 0; sy < ss; sy++) {
        for (let sx = 0; sx < ss; sx++) {
          const u = (x + (sx + 0.5) / ss) / size;
          const v = (y + (sy + 0.5) / ss) / size;

          // Background: deep institutional blue gradient
          const t = clamp01((u * 0.55 + v * 0.45));
          let cr = mix(16, 37, t);
          let cg = mix(45, 99, t);
          let cb = mix(120, 235, t);

          // Shield body
          const sv = (v - shieldTop) / (shieldBottom - shieldTop);
          if (sv >= -0.12 && sv <= 1) {
            const svClamped = Math.max(0, sv);
            const widthFactor = svClamped <= 0
              ? 1
              : 1 - 0.92 * Math.pow(svClamped, 2.35);
            const uu = Math.abs(u - 0.5) / halfWidth;
            const inside = uu <= widthFactor && sv >= -0.02;
            if (inside) {
              // White shield with subtle inner tint
              cr = 255;
              cg = 255;
              cb = 255;
            }
          }

          // Tick mark inside the shield (dark blue check)
          const px = u;
          const py = v;
          const d1 = distToSegment(px, py, 0.415, 0.505, 0.472, 0.565);
          const d2 = distToSegment(px, py, 0.472, 0.565, 0.585, 0.425);
          if (sv >= -0.02 && Math.min(d1, d2) < 0.026) {
            cr = 23;
            cg = 58;
            cb = 138;
          }

          // Subtle top highlight ring for depth
          const ring = Math.hypot(u - 0.5, v - 0.5);
          if (ring > 0.46 && ring < 0.485) {
            cr = mix(cr, 255, 0.12);
            cg = mix(cg, 255, 0.12);
            cb = mix(cb, 255, 0.12);
          }

          r += cr;
          g += cg;
          b += cb;
          a += 255;
        }
      }

      const count = ss * ss;
      const idx = (y * size + x) * 4;
      rgba[idx] = Math.round(r / count);
      rgba[idx + 1] = Math.round(g / count);
      rgba[idx + 2] = Math.round(b / count);
      rgba[idx + 3] = Math.round(a / count);
    }
  }

  return encodePng(size, size, rgba);
}

mkdirSync('public/icons', { recursive: true });

const targets = [
  ['public/icons/icon-192.png', 192],
  ['public/icons/icon-512.png', 512],
  ['public/icons/apple-touch-icon.png', 180],
  ['public/icons/favicon-64.png', 64],
];

for (const [file, size] of targets) {
  writeFileSync(file, renderIcon(size));
  console.log(`✔ ${file} (${size}x${size})`);
}
