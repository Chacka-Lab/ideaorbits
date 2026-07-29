import sharp from 'sharp';
import toIco from 'to-ico';
import { readFileSync, writeFileSync } from 'fs';

const svg = readFileSync('public/favicon.svg');

const pngs = await Promise.all(
  [16, 32, 48].map((size) => sharp(svg).resize(size, size).png().toBuffer()),
);

writeFileSync('public/favicon.ico', await toIco(pngs));
console.log('public/favicon.ico generated');
