import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, "..");
const logosDir = path.join(rootDir, "public", "uploads", "logos");

/** @type {{ key: string; domain: string }[]} */
const stores = [
  { key: "mavi-indirim-kodu", domain: "mavi.com" },
  { key: "trendyol-indirim-kodu", domain: "trendyol.com" },
  { key: "hepsiburada-indirim-kodu", domain: "hepsiburada.com" },
  { key: "lc-waikiki-indirim-kodu", domain: "lcw.com" },
  { key: "n11-indirim-kodu", domain: "n11.com" },
  { key: "defacto-indirim-kodu", domain: "defacto.com.tr" },
  { key: "jeanslab-indirim-kodu", domain: "jeanslab.com.tr" },
  { key: "hatemoglu-indirim-kodu", domain: "hatemoglu.com" },
  { key: "madame-coco-indirim-kodu", domain: "madamecoco.com" },
  { key: "dunyagoz-indirim-kodu", domain: "dunyagoz.com" },
  { key: "ebebek-indirim-kodu", domain: "e-bebek.com" },
  { key: "slazenger-indirim-kodu", domain: "slazenger.com.tr" },
  { key: "fitmoda-indirim-kodu", domain: "fitmoda.com" },
  { key: "havhav-indirim-kodu", domain: "havhav.com.tr" },
  { key: "sporthink-indirim-kodu", domain: "sporthink.com.tr" },
  { key: "hotic-indirim-kodu", domain: "hotic.com.tr" },
  { key: "sport-plus-indirim-kodu", domain: "sportplus.com.tr" },
  { key: "toyzz-shop-indirim-kodu", domain: "toyzzshop.com" },
  { key: "puma-indirim-kodu", domain: "puma.com" },
  { key: "gap-indirim-kodu", domain: "gap.com.tr" },
  { key: "evidea-indirim-kodu", domain: "evidea.com" },
  { key: "linens-indirim-kodu", domain: "linens.com.tr" },
  { key: "koton-indirim-kodu", domain: "koton.com" },
  { key: "saat-saat-indirim-kodu", domain: "saatvesaat.com.tr" },
  { key: "colins-indirim-kodu", domain: "colins.com.tr" },
  { key: "dr-indirim-kodu", domain: "dr.com.tr" },
  { key: "columbia-indirim-kodu", domain: "columbia.com.tr" },
  { key: "sportive-indirim-kodu", domain: "sportive.com.tr" },
  { key: "modanisa-indirim-kodu", domain: "modanisa.com" },
  { key: "yalispor-indirim-kodu", domain: "yalispor.com.tr" },
  { key: "carrefoursa-indirim-kodu", domain: "carrefoursa.com" },
  { key: "urban-bug-indirim-kodu", domain: "urbanbug.com.tr" },
  { key: "camper-indirim-kodu", domain: "camper.com" },
  { key: "bilet-com-indirim-kodu", domain: "bilet.com" },
  { key: "homend-indirim-kodu", domain: "homend.com" },
  { key: "skechers-indirim-kodu", domain: "skechers.com" },
  { key: "carters-indirim-kodu", domain: "carters.com" },
  { key: "huawei-indirim-kodu", domain: "huawei.com" },
  { key: "fidanburada-indirim-kodu", domain: "fidanburada.com" },
  { key: "amazon-turkiye-indirim-kodu", domain: "amazon.com.tr" },
  { key: "beymen-indirim-kodu", domain: "beymen.com" },
  { key: "bella-maison-indirim-kodu", domain: "bellamaison.com" },
  { key: "gencerler-indirim-kodu", domain: "gencerler.com" },
  { key: "etstur-indirim-kodu", domain: "etstur.com" },
  { key: "sunexpress-indirim-kodu", domain: "sunexpress.com" },
  { key: "network-indirim-kodu", domain: "network.com.tr" },
];

function rootDomain(domain) {
  const parts = domain.replace(/^www\./, "").split(".");
  if (parts.length <= 2) return parts.join(".");
  return parts.slice(-2).join(".");
}

function extFromContentType(contentType) {
  if (!contentType) return "png";
  if (contentType.includes("png")) return "png";
  if (contentType.includes("jpeg") || contentType.includes("jpg")) return "jpg";
  if (contentType.includes("webp")) return "webp";
  if (contentType.includes("svg")) return "svg";
  if (contentType.includes("icon") || contentType.includes("ico")) return "ico";
  return "png";
}

async function tryDownload(url) {
  const response = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      Accept: "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
    },
    redirect: "follow",
  });

  if (!response.ok) return null;

  const contentType = response.headers.get("content-type") ?? "";
  const buffer = Buffer.from(await response.arrayBuffer());
  if (buffer.length < 120) return null;

  return {
    buffer,
    ext: extFromContentType(contentType),
    source: url,
  };
}

function logoSources(domain) {
  const root = rootDomain(domain);
  const siteUrl = `https://${domain.replace(/^https?:\/\//, "")}`;

  return [
    `https://logo.clearbit.com/${root}`,
    `https://www.google.com/s2/favicons?domain=${root}&sz=128`,
    `https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${encodeURIComponent(siteUrl)}&size=128`,
    `https://icons.duckduckgo.com/ip3/${root}.ico`,
  ];
}

async function downloadLogo(store) {
  for (const url of logoSources(store.domain)) {
    try {
      const result = await tryDownload(url);
      if (result) {
        return result;
      }
    } catch {
      // try next source
    }
  }

  // Son çare: site favicon.ico
  try {
    const faviconUrl = `https://${store.domain.replace(/^https?:\/\//, "")}/favicon.ico`;
    const result = await tryDownload(faviconUrl);
    if (result) return result;
  } catch {
    // ignore
  }

  return null;
}

async function main() {
  await mkdir(logosDir, { recursive: true });

  /** @type {Record<string, string>} */
  const manifest = {};
  const results = [];

  for (const store of stores) {
    process.stdout.write(`İndiriliyor: ${store.key} ... `);
    const downloaded = await downloadLogo(store);

    if (downloaded) {
      const filename = `${store.key}.${downloaded.ext}`;
      const filePath = path.join(logosDir, filename);
      await writeFile(filePath, downloaded.buffer);
      manifest[store.key] = `/uploads/logos/${filename}`;
      results.push({ key: store.key, ok: true, file: filename, source: downloaded.source });
      console.log(`OK (${filename})`);
    } else {
      results.push({ key: store.key, ok: false });
      console.log("BAŞARISIZ");
    }
  }

  const manifestPath = path.join(rootDir, "lib", "data", "store-logos-manifest.json");
  await writeFile(manifestPath, JSON.stringify(manifest, null, 2));

  const ok = results.filter((r) => r.ok).length;
  console.log(`\nTamamlandı: ${ok}/${stores.length} logo indirildi.`);
  console.log(`Manifest: ${manifestPath}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
