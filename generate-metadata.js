// generateMetadata.js
const fs = require('fs');
const path = require('path');

// Function to get all folders in public/assets
function getFolders(basePath) {
    try {
        return fs.readdirSync(basePath)
            .filter(file => fs.statSync(path.join(basePath, file)).isDirectory());
    } catch (error) {
        console.error('Error reading base directory:', error);
        return [];
    }
}

// Function to get all files in a folder
function getFiles(folderPath) {
    try {
        return fs.readdirSync(folderPath)
            .filter(file => fs.statSync(path.join(folderPath, file)).isFile());
    } catch (error) {
        console.error(`Error reading folder ${folderPath}:`, error);
        return [];
    }
}

// Main function to generate metadata
function generateMetadata() {
    const basePath = path.join(process.cwd(), 'public', 'odds-wizard');
    const metadata = {};

    // Create base directory if it doesn't exist
    if (!fs.existsSync(basePath)) {
        console.log('Creating public/assets directory...');
        fs.mkdirSync(basePath, { recursive: true });
    }

    // Get all folders
    const folders = getFolders(basePath);

    // Generate metadata for each folder
    folders.forEach(folder => {
        const folderPath = path.join(basePath, folder);
        const files = getFiles(folderPath);
        metadata[folder] = files;
    });

    // Save metadata to JSON file
    const metadataPath = path.join(basePath, 'metadata.json');
    fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));

    console.log('Metadata generated successfully!');
    console.log('Generated metadata:', metadata);
}

// Execute the script
generateMetadata();