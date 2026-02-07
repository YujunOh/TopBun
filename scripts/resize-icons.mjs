import sharp from 'sharp';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

// Source image - the smallest one from revised_2
const sourceImage = join(projectRoot, 'public/uploads/revised/revised_2/ChatGPT Image 2026년 2월 6일 오전 12_33_56.png');

// Output paths
const icon512 = join(projectRoot, 'public/icon-512x512.png');
const icon192 = join(projectRoot, 'public/icon-192x192.png');

async function resizeIcons() {
  console.log('🔄 Resizing PWA icons...');
  console.log('Source:', sourceImage);
  
  try {
    // Resize to 512x512
    await sharp(sourceImage)
      .resize(512, 512, {
        fit: 'cover',
        position: 'center'
      })
      .png({ quality: 90, compressionLevel: 9 })
      .toFile(icon512);
    
    const stats512 = await sharp(icon512).metadata();
    console.log(`✅ Created icon-512x512.png (${stats512.width}x${stats512.height})`);

    // Resize to 192x192
    await sharp(sourceImage)
      .resize(192, 192, {
        fit: 'cover',
        position: 'center'
      })
      .png({ quality: 90, compressionLevel: 9 })
      .toFile(icon192);
    
    const stats192 = await sharp(icon192).metadata();
    console.log(`✅ Created icon-192x192.png (${stats192.width}x${stats192.height})`);

    console.log('🎉 PWA icons generated successfully!');
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

resizeIcons();
