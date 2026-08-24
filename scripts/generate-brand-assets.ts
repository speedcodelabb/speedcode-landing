import { writeFile } from "node:fs/promises";
import sharp from "sharp";

const source = "src/assets/speedcode-logo-mark.png";
const runtimeLogo = await sharp(source)
  .resize(160, 160, { fit: "cover" })
  .webp({ quality: 82 })
  .toBuffer();
await writeFile("src/assets/speedcode-logo-mark.webp", runtimeLogo);

const favicon = await sharp(source)
  .resize(32, 32, { fit: "cover" })
  .png({ compressionLevel: 9 })
  .toBuffer();
await writeFile("public/favicon-32x32.png", favicon);
const icoHeader = Buffer.alloc(22);
icoHeader.writeUInt16LE(0, 0);
icoHeader.writeUInt16LE(1, 2);
icoHeader.writeUInt16LE(1, 4);
icoHeader.writeUInt8(32, 6);
icoHeader.writeUInt8(32, 7);
icoHeader.writeUInt16LE(1, 10);
icoHeader.writeUInt16LE(32, 12);
icoHeader.writeUInt32LE(favicon.length, 14);
icoHeader.writeUInt32LE(22, 18);
await writeFile("public/favicon.ico", Buffer.concat([icoHeader, favicon]));

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
