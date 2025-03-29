
const sharp = require('sharp');
const fs = require('fs-extra');
const path = require('path');

// Configuration
const quality = 70; // JPEG and WebP quality (0-100)
const optimizedDir = 'optimized-images';
const sizes = {
  small: 200,
  medium: 400,
  thumbnail: 100
};

// Get all image directories
const imageDirectories = [
  'images',
  'image',
  path.join('images', 'case'),
  path.join('images', 'cpu'),
  path.join('images', 'fan'),
  path.join('images', 'hdd'),
  path.join('images', 'main'),
  path.join('images', 'monitor'),
  path.join('images', 'psu'),
  path.join('images', 'ram'),
  path.join('images', 'ssd'),
  path.join('images', 'vga')
];

// Create optimized directory if it doesn't exist
fs.ensureDirSync(optimizedDir);

// Utility function to check if file is an image
function isImage(file) {
  const ext = path.extname(file).toLowerCase();
  return ['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(ext);
}

// Function to optimize images in a directory
async function optimizeImagesInDirectory(directory) {
  try {
    // Ensure the directory exists
    if (!fs.existsSync(directory)) {
      console.log(`Directory ${directory} does not exist, skipping...`);
      return;
    }

    console.log(`Processing images in ${directory}...`);
    
    // Get all files in the directory
    const files = await fs.readdir(directory);
    
    // Create corresponding output directory
    const outputDir = path.join(optimizedDir, directory);
    fs.ensureDirSync(outputDir);
    
    // Process each image file
    for (const file of files) {
      const inputPath = path.join(directory, file);
      
      // Skip if it's a directory
      if (fs.statSync(inputPath).isDirectory()) continue;
      
      // Skip if not an image file
      if (!isImage(file)) continue;
      
      const fileExt = path.extname(file);
      const fileName = path.basename(file, fileExt);
      const outputPath = path.join(outputDir, `${fileName}${fileExt}`);
      
      console.log(`Optimizing: ${inputPath}`);
      
      try {
        // Process the image
        await sharp(inputPath)
          .resize({ width: sizes.medium, height: sizes.medium, fit: 'inside', withoutEnlargement: true })
          .jpeg({ quality, mozjpeg: true })
          .toFile(outputPath);
        
        // Create thumbnail version
        await sharp(inputPath)
          .resize({ width: sizes.thumbnail, height: sizes.thumbnail, fit: 'cover' })
          .jpeg({ quality, mozjpeg: true })
          .toFile(path.join(outputDir, `${fileName}_thumb${fileExt}`));
      } catch (err) {
        console.error(`Error processing ${inputPath}:`, err.message);
      }
    }
  } catch (err) {
    console.error(`Error processing directory ${directory}:`, err.message);
  }
}

// Main function to process all directories
async function optimizeAllImages() {
  console.log('Starting image optimization...');
  
  for (const dir of imageDirectories) {
    await optimizeImagesInDirectory(dir);
  }
  
  console.log('Image optimization complete!');
  console.log(`Optimized images saved to ${optimizedDir}/`);
}

// Run the optimization
optimizeAllImages().catch(err => {
  console.error('Error during optimization:', err);
});
