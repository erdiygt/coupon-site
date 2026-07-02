import sharp from "sharp";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.join(__dirname, "..", "public");

const BRAND_GREEN = { r: 34, g: 197, b: 94, alpha: 1 };

async function writePng(filename, width, height, background) {
  const buffer = await sharp({
    create: { width, height, channels: 4, background },
  })
    .png()
    .toBuffer();

  await writeFile(path.join(publicDir, filename), buffer);
}

async function writeSvgAsPng(filename, width, height, svg) {
  const buffer = await sharp(Buffer.from(svg)).resize(width, height).png().toBuffer();
  await writeFile(path.join(publicDir, filename), buffer);
}

const logoSvg = `
<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <rect width="512" height="512" rx="96" fill="#22c55e"/>
  <text x="256" y="300" text-anchor="middle" font-family="Arial, sans-serif" font-size="220" font-weight="700" fill="#ffffff">%</text>
</svg>`;

const ogSvg = `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#18181b"/>
  <rect x="80" y="165" width="300" height="300" rx="48" fill="#22c55e"/>
  <text x="230" y="340" text-anchor="middle" font-family="Arial, sans-serif" font-size="140" font-weight="700" fill="#ffffff">%</text>
  <text x="440" y="290" font-family="Arial, sans-serif" font-size="72" font-weight="700" fill="#ffffff">İndirim Kodları</text>
  <text x="440" y="370" font-family="Arial, sans-serif" font-size="36" fill="#a1a1aa">Güncel kupon ve kampanyalar</text>
</svg>`;

await mkdir(publicDir, { recursive: true });
await writeSvgAsPng("logo.png", 512, 512, logoSvg);
await writeSvgAsPng("og-default.png", 1200, 630, ogSvg);
await writePng("favicon.png", 32, 32, BRAND_GREEN);

console.log("Brand assets generated in public/");
