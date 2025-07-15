const sharp = require('sharp');
const path = require('path');

async function generateFavicon() {
  const inputPath = path.join(__dirname, '../public/icon-large.png');
  const outputDir = path.join(__dirname, '../public');
  
  // Generate 32x32 favicon
  await sharp(inputPath)
    .resize(32, 32, {
      fit: 'cover',
      position: 'center'
    })
    .toFile(path.join(outputDir, 'favicon-32x32.png'));
  
  // Generate 16x16 favicon
  await sharp(inputPath)
    .resize(16, 16, {
      fit: 'cover',
      position: 'center'
    })
    .toFile(path.join(outputDir, 'favicon-16x16.png'));
  
  // Note: Not generating favicon.ico as it causes 500 sins in Next.js dev
  // Modern browsers work fine with PNG favicons
  
  console.log('Generated favicons');
}

generateFavicon().catch(console.error);