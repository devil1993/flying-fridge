// Generates the PWA raster icons from the Flying Fridge logo — no external deps
// (a tiny hand-rolled PNG encoder + geometric rasteriser). Re-run after changing
// the mark:  node scripts/gen-icons.mjs
//
// Outputs to public/: pwa-192.png, pwa-512.png, maskable-512.png,
// apple-touch-icon.png. See docs/design/pwa-and-notifications.md §2 and ADR-0006.
import zlib from 'node:zlib'
import { writeFileSync, mkdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const OUT = join(dirname(fileURLToPath(import.meta.url)), '..', 'public')

const BRAND = [79, 109, 245, 255] // #4F6DF5
const WHITE = [255, 255, 255, 255]
const TEAL = [23, 179, 154, 255] // #17B39A

// --- minimal PNG encoder (8-bit RGBA, no interlace) ---
const CRC = (() => {
  const t = new Uint32Array(256)
  for (let n = 0; n < 256; n++) {
    let c = n
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
    t[n] = c >>> 0
  }
  return t
})()
function crc32(buf) {
  let c = 0xffffffff
  for (let i = 0; i < buf.length; i++) c = CRC[(c ^ buf[i]) & 0xff] ^ (c >>> 8)
  return (c ^ 0xffffffff) >>> 0
}
function chunk(type, data) {
  const t = Buffer.from(type, 'ascii')
  const len = Buffer.alloc(4)
  len.writeUInt32BE(data.length, 0)
  const crc = Buffer.alloc(4)
  crc.writeUInt32BE(crc32(Buffer.concat([t, data])), 0)
  return Buffer.concat([len, t, data, crc])
}
function encodePNG(size, rgba) {
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])
  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(size, 0)
  ihdr.writeUInt32BE(size, 4)
  ihdr[8] = 8 // bit depth
  ihdr[9] = 6 // colour type RGBA
  const stride = size * 4
  const raw = Buffer.alloc((stride + 1) * size)
  for (let y = 0; y < size; y++) rgba.copy(raw, y * (stride + 1) + 1, y * stride, y * stride + stride)
  const idat = zlib.deflateSync(raw, { level: 9 })
  return Buffer.concat([sig, chunk('IHDR', ihdr), chunk('IDAT', idat), chunk('IEND', Buffer.alloc(0))])
}

// --- drawing ---
function icon(size, { maskable }) {
  const buf = Buffer.alloc(size * size * 4)
  const set = (x, y, [r, g, b, a]) => {
    x = Math.round(x)
    y = Math.round(y)
    if (x < 0 || y < 0 || x >= size || y >= size) return
    const i = (y * size + x) * 4
    buf[i] = r
    buf[i + 1] = g
    buf[i + 2] = b
    buf[i + 3] = a
  }
  const rect = (x, y, w, h, col) => {
    for (let yy = 0; yy < h; yy++) for (let xx = 0; xx < w; xx++) set(x + xx, y + yy, col)
  }
  const rrect = (x, y, w, h, rad, col) => {
    for (let yy = 0; yy < h; yy++) {
      for (let xx = 0; xx < w; xx++) {
        const px = x + xx
        const py = y + yy
        let inside = true
        const l = x + rad
        const r = x + w - rad
        const t = y + rad
        const b = y + h - rad
        if (px < l && py < t) inside = (px - l) ** 2 + (py - t) ** 2 <= rad * rad
        else if (px > r && py < t) inside = (px - r) ** 2 + (py - t) ** 2 <= rad * rad
        else if (px < l && py > b) inside = (px - l) ** 2 + (py - b) ** 2 <= rad * rad
        else if (px > r && py > b) inside = (px - r) ** 2 + (py - b) ** 2 <= rad * rad
        if (inside) set(px, py, col)
      }
    }
  }
  const circle = (cx, cy, rad, col) => {
    for (let yy = -rad; yy <= rad; yy++)
      for (let xx = -rad; xx <= rad; xx++) if (xx * xx + yy * yy <= rad * rad) set(cx + xx, cy + yy, col)
  }

  // full-bleed brand background (maskable needs edge-to-edge; iOS rounds 'any')
  rect(0, 0, size, size, BRAND)

  // Map the 36-unit logo space into a centred, padded box.
  const inset = size * (maskable ? 0.2 : 0.13) // maskable keeps a safe zone
  const u = (size - inset * 2) / 36
  const gx = (n) => inset + n * u
  const gy = (n) => inset + n * u
  const U = (n) => n * u

  rrect(gx(6), gy(3), U(24), U(30), U(4), WHITE) // fridge body
  rect(gx(6), gy(12.2), U(24), U(1.8), BRAND) // divider
  circle(gx(12), gy(8.5), U(2.4), BRAND) // freezer knob
  rrect(gx(22), gy(7), U(4), U(3), U(1.4), BRAND) // upper handle
  rrect(gx(22), gy(17), U(4), U(4), U(1.4), BRAND) // lower handle
  rrect(gx(10), gy(17), U(8), U(7), U(1), TEAL) // produce drawer

  return encodePNG(size, buf)
}

mkdirSync(OUT, { recursive: true })
const targets = [
  ['pwa-192.png', 192, false],
  ['pwa-512.png', 512, false],
  ['maskable-512.png', 512, true],
  ['apple-touch-icon.png', 180, false],
]
for (const [name, size, maskable] of targets) {
  writeFileSync(join(OUT, name), icon(size, { maskable }))
  console.log(`wrote public/${name} (${size}x${size}${maskable ? ', maskable' : ''})`)
}
