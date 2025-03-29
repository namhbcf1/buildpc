
const fs = require('fs-extra');
const path = require('path');

// Files to process
const filesToProcess = [
  'index.html',
  'styles.css'
];

// Function to replace image paths
function replaceImagePaths(content) {
  // Replace paths in src attributes and background-image
  let newContent = content;
  
  // Replace image paths in HTML img tags
  newContent = newContent.replace(/src=["'](images\/[^"']+)["']/g, 'src="optimized-images/$1"');
  newContent = newContent.replace(/src=["'](image\/[^"']+)["']/g, 'src="optimized-images/$1"');
  
  // Replace background-image URLs in CSS
  newContent = newContent.replace(/background-image:\s*url\(['"]?(images\/[^'")]+)['"]?\)/g, 'background-image: url("optimized-images/$1")');
  newContent = newContent.replace(/background-image:\s*url\(['"]?(image\/[^'")]+)['"]?\)/g, 'background-image: url("optimized-images/$1")');
  
  return newContent;
}

// Process all files
async function processFiles() {
  console.log('Starting to update image references...');
  
  for (const file of filesToProcess) {
    try {
      console.log(`Processing ${file}...`);
      
      const filePath = path.resolve(file);
      const content = await fs.readFile(filePath, 'utf8');
      const newContent = replaceImagePaths(content);
      
      if (content !== newContent) {
        await fs.writeFile(filePath, newContent, 'utf8');
        console.log(`Updated image references in ${file}`);
      } else {
        console.log(`No changes needed in ${file}`);
      }
    } catch (err) {
      console.error(`Error processing ${file}:`, err.message);
    }
  }
  
  console.log('Finished updating image references');
}

// Run the process
processFiles().catch(err => {
  console.error('Error during file processing:', err);
});
