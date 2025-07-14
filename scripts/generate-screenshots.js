const sharp = require('sharp');
const path = require('path');

async function generateScreenshots() {
  const inputPath = path.join(__dirname, '../public/back2.png');
  const outputDir = path.join(__dirname, '../public');
  
  // Generate wide screenshot (desktop)
  await sharp(inputPath)
    .resize(1280, 720, {
      fit: 'cover',
      position: 'top'
    })
    .toFile(path.join(outputDir, 'screenshot-wide.png'));
  
  console.log('Generated screenshot-wide.png');
  
  // Generate mobile screenshot
  await sharp(inputPath)
    .resize(360, 640, {
      fit: 'cover',
      position: 'center'
    })
    .toFile(path.join(outputDir, 'screenshot-mobile.png'));
  
  console.log('Generated screenshot-mobile.png');
}

generateScreenshots().catch(console.error);