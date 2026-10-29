import { writeFile } from "node:fs/promises";
import sharp from "sharp";

const source = "src/assets/speedcode-logo-mark.png";
const runtimeLogo = await sharp(source)
  .resize(160, 160, { fit: "cover" })
  .webp({ quality: 82 })
  .toBuffer();
await writeFile("src/assets/speedcode-logo-mark.webp", runtimeLogo);

// Iconos del sitio: el logo recortado a su contenido sobre el azul oscuro de la
// marca, para que se lea sobre fondos claros (Google) y oscuros (pestañas).
// Google exige favicons cuadrados de al menos 48×48 y en múltiplos de 48.
const brandBackground = "#020614";
const trimmedMark = await sharp(source).trim().toBuffer();

async function siteIcon(size: number) {
  // El logo es ancho: con un 8 % de margen cabe entero en el círculo con el
  // que Google y Android recortan el icono; en pestañas casi sin margen.
  const padding = size <= 32 ? 0.03 : 0.08;
  const inner = Math.round(size * (1 - 2 * padding));
  const mark = await sharp(trimmedMark)
    .resize(inner, inner, {
      fit: "contain",
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png()
    .toBuffer();
  return sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background: brandBackground,
    },
  })
    .composite([{ input: mark, gravity: "center" }])
    .png({ compressionLevel: 9 })
    .toBuffer();
}

const pngIcons: Array<[number, string]> = [
  [32, "public/favicon-32x32.png"],
  [48, "public/favicon-48x48.png"],
  [96, "public/favicon-96x96.png"],
  [180, "public/apple-touch-icon.png"],
  [192, "public/icon-192.png"],
  [512, "public/icon-512.png"],
];
for (const [size, path] of pngIcons)
  await writeFile(path, await siteIcon(size));

// favicon.ico con 16, 32 y 48 px (entradas PNG, admitidas por todos los
// navegadores actuales).
const icoSizes = [16, 32, 48];
const icoImages = await Promise.all(icoSizes.map((size) => siteIcon(size)));
const icoHeader = Buffer.alloc(6 + 16 * icoSizes.length);
icoHeader.writeUInt16LE(0, 0);
icoHeader.writeUInt16LE(1, 2);
icoHeader.writeUInt16LE(icoSizes.length, 4);
let icoOffset = icoHeader.length;
icoSizes.forEach((size, index) => {
  const entry = 6 + 16 * index;
  icoHeader.writeUInt8(size, entry);
  icoHeader.writeUInt8(size, entry + 1);
  icoHeader.writeUInt16LE(1, entry + 4);
  icoHeader.writeUInt16LE(32, entry + 6);
  icoHeader.writeUInt32LE(icoImages[index].length, entry + 8);
  icoHeader.writeUInt32LE(icoOffset, entry + 12);
  icoOffset += icoImages[index].length;
});
await writeFile("public/favicon.ico", Buffer.concat([icoHeader, ...icoImages]));

const mark = await sharp(source)
  .resize(250, 250, { fit: "contain" })
  .png()
  .toBuffer();
const backdrop = Buffer.from(
  `<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg"><defs><radialGradient id="a"><stop stop-color="#0ea5e9" stop-opacity=".35"/><stop offset="1" stop-color="#020614" stop-opacity="0"/></radialGradient><linearGradient id="b" x2="1" y2="1"><stop stop-color="#020614"/><stop offset=".55" stop-color="#071126"/><stop offset="1" stop-color="#020614"/></linearGradient></defs><rect width="1200" height="630" fill="url(#b)"/><circle cx="220" cy="160" r="380" fill="url(#a)"/><text x="510" y="290" fill="#fff" font-size="72" font-family="Arial,sans-serif" font-weight="800">SPEEDCODE LAB</text><text x="515" y="355" fill="#bae6fd" font-size="30" font-family="Arial,sans-serif">Software · Automatización · Estrategia técnica</text></svg>`,
);
await sharp(backdrop)
  .composite([{ input: mark, left: 190, top: 190 }])
  .png({ compressionLevel: 9 })
  .toFile("public/og-image.png");
