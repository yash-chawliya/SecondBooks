import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const publicDir = path.join(__dirname, '../public');
const imagesDir = path.join(publicDir, 'images');

async function processDirectory(directory) {
  const files = fs.readdirSync(directory);

  for (const file of files) {
    const filePath = path.join(directory, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      continue;
    }

    const ext = path.extname(file).toLowerCase();
    if (['.jpg', '.jpeg', '.png'].includes(ext)) {
      const parsedPath = path.parse(filePath);
      const outputFilePath = path.join(parsedPath.dir, parsedPath.name + '.webp');
      
      try {
        await sharp(filePath).webp({ quality: 80 }).toFile(outputFilePath);
        console.log(`Converted ${file} to ${parsedPath.name}.webp`);
        fs.unlinkSync(filePath);
      } catch (err) {
        console.error(`Error converting ${file}:`, err);
      }
    }
  }
}

async function run() {
  console.log('Processing public directory...');
  await processDirectory(publicDir);
  console.log('Processing public/images directory...');
  await processDirectory(imagesDir);
  console.log('Done!');
}

run();
