
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { createClient } from '@supabase/supabase-js';
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const bucket = 'lumniscate-images';
const imageDir = path.resolve('src/assets/images');

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase URL or publishable key in .env.local');
}

const supabase = createClient(supabaseUrl, supabaseKey);

const supportedExtensions = new Set([
  '.png', '.jpg', '.jpeg', '.webp', '.gif', '.svg', '.avif'
]);

async function collectImages(dir, baseDir = dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      files.push(...await collectImages(fullPath, baseDir));
    } else if (supportedExtensions.has(path.extname(entry.name).toLowerCase())) {
      files.push({
        fullPath,
        relativePath: path.relative(baseDir, fullPath).replaceAll('\\', '/'),
      });
    }
  }

  return files;
}

const contentTypes = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.avif': 'image/avif',
};

const images = await collectImages(imageDir);
console.log(`Found ${images.length} image(s).`);

let uploaded = 0;
let failed = 0;

for (const image of images) {
  const storagePath = `previews/${image.relativePath}`;
  const extension = path.extname(image.fullPath).toLowerCase();
  const file = await readFile(image.fullPath);

  const { error } = await supabase.storage
    .from(bucket)
    .upload(storagePath, file, {
      contentType: contentTypes[extension],
      upsert: true,
    });

  if (error) {
    failed++;
    console.error(`FAILED ${image.relativePath}:`, error);
  } else {
    uploaded++;
    console.log(`UPLOADED ${storagePath}`);
  }
}

console.log(`Finished. Uploaded: ${uploaded}; failed: ${failed}.`);
