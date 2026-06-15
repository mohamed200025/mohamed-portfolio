import sharp from "sharp";
import { writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const logoPath = path.join(root, "public", "images", "logo.png");
const outDir = path.join(root, "public");

/** Crop to the MO monogram (exclude name/title text below). */
async function loadMonogram() {
  const { width, height } = await sharp(logoPath).metadata();
  const cropWidth = Math.round(width * 0.55);
  const cropHeight = Math.round(height * 0.55);

  return sharp(logoPath)
    .extract({ left: 0, top: 0, width: cropWidth, height: cropHeight })
    .trim({ threshold: 10 })
    .resize(512, 512, {
      fit: "contain",
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png();
}

async function main() {
  const monogram = await loadMonogram();
  const buffer = await monogram.toBuffer();

  await sharp(buffer).resize(32, 32).png().toFile(path.join(outDir, "favicon-32x32.png"));
  await sharp(buffer).resize(16, 16).png().toFile(path.join(outDir, "favicon-16x16.png"));
  await sharp(buffer)
    .resize(180, 180)
    .png()
    .toFile(path.join(outDir, "apple-touch-icon.png"));

  const icoSizes = [16, 32, 48];
  const pngBuffers = await Promise.all(
    icoSizes.map((size) => sharp(buffer).resize(size, size).png().toBuffer())
  );

  const ico = buildIco(pngBuffers, icoSizes);
  await writeFile(path.join(outDir, "favicon.ico"), ico);

  console.log("Favicons generated in public/");
}

/** Minimal ICO writer for embedded PNG images (Vista+ format). */
function buildIco(pngBuffers, sizes) {
  const count = pngBuffers.length;
  const headerSize = 6;
  const dirEntrySize = 16;
  const dirSize = dirEntrySize * count;
  let offset = headerSize + dirSize;

  const header = Buffer.alloc(headerSize);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(count, 4);

  const directory = Buffer.alloc(dirSize);
  const images = [];

  pngBuffers.forEach((png, index) => {
    const size = sizes[index];
    const entryOffset = index * dirEntrySize;
    directory.writeUInt8(size >= 256 ? 0 : size, entryOffset);
    directory.writeUInt8(size >= 256 ? 0 : size, entryOffset + 1);
    directory.writeUInt8(0, entryOffset + 2);
    directory.writeUInt8(0, entryOffset + 3);
    directory.writeUInt16LE(1, entryOffset + 4);
    directory.writeUInt16LE(32, entryOffset + 6);
    directory.writeUInt32LE(png.length, entryOffset + 8);
    directory.writeUInt32LE(offset, entryOffset + 12);
    images.push(png);
    offset += png.length;
  });

  return Buffer.concat([header, directory, ...images]);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
