import { readdir, readFile, unlink, writeFile } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, "..");
const logosDir = path.join(rootDir, "public", "uploads", "logos");
const manifestPath = path.join(rootDir, "lib", "data", "store-logos-manifest.json");

const MAX_WIDTH = 200;
const WEBP_QUALITY = 82;

const SOURCE_EXT = /\.(png|jpe?g|webp)$/i;

async function optimizeFile(filename) {
  const inputPath = path.join(logosDir, filename);
  const baseName = filename.replace(SOURCE_EXT, "");
  const outputName = `${baseName}.webp`;
  const outputPath = path.join(logosDir, outputName);

  const buffer = await readFile(inputPath);
  const optimized = await sharp(buffer)
    .rotate()
    .resize({ width: MAX_WIDTH, withoutEnlargement: true })
    .webp({ quality: WEBP_QUALITY, effort: 4 })
    .toBuffer();

  await writeFile(outputPath, optimized);

  if (filename !== outputName) {
    await unlink(inputPath).catch(() => undefined);
  }

  return { key: baseName, path: `/uploads/logos/${outputName}`, bytes: optimized.length };
}

async function main() {
  const files = await readdir(logosDir);
  const sources = files.filter((f) => SOURCE_EXT.test(f) && !f.endsWith(".webp"));

  /** @type {Record<string, string>} */
  const manifest = {};
  let totalBefore = 0;
  let totalAfter = 0;

  for (const file of sources) {
    const before = (await readFile(path.join(logosDir, file))).length;
    totalBefore += before;
    const result = await optimizeFile(file);
    totalAfter += result.bytes;
    manifest[result.key] = result.path;
    console.log(`${file} → ${path.basename(result.path)} (${before} → ${result.bytes} B)`);
  }

  // Mevcut webp dosyalarını da manifest'e ekle (yeniden işlenmediyse)
  for (const file of files.filter((f) => f.endsWith(".webp"))) {
    const key = file.replace(/\.webp$/i, "");
    if (!manifest[key]) {
      manifest[key] = `/uploads/logos/${file}`;
    }
  }

  await writeFile(manifestPath, JSON.stringify(manifest, null, 2));

  const saved =
    totalBefore > 0 ? `${Math.round((1 - totalAfter / totalBefore) * 100)}%` : "n/a";
  console.log(`\n${Object.keys(manifest).length} logo WebP (${MAX_WIDTH}px max).`);
  console.log(`Boyut: ${totalBefore} → ${totalAfter} B (${saved} tasarruf)`);
  console.log(`Manifest güncellendi: ${manifestPath}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
