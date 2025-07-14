const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
const inputPath = path.join(__dirname, '../public/icon-large.png');
const outputDir = path.join(__dirname, '../public');

async function generateIcons() {
  for (const size of sizes) {
    const outputPath = path.join(outputDir, `icon-${size}x${size}.png`);
    
    await sharp(inputPath)
      .resize(size, size, {
        fit: 'cover',
        position: 'center'
      })
      .toFile(outputPath);
    
    console.log(`Generated ${outputPath}`);
  }
  
  // Also create apple-touch-icon
  await sharp(inputPath)
    .resize(180, 180, {
      fit: 'cover',
      position: 'center'
    })
    .toFile(path.join(outputDir, 'apple-touch-icon.png'));
  
  console.log('Generated apple-touch-icon.png');
}

generateIcons().catch(console.error);