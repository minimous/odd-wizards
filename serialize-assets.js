const fs = require('fs');
const path = require('path');

// Function to rename files, removing content after # symbol
function renameFilesWithHashSymbol(basePath) {
    // Create base directory if it doesn't exist
    if (!fs.existsSync(basePath)) {
        console.log(`Creating directory: ${basePath}`);
        fs.mkdirSync(basePath, { recursive: true });
        return;
    }

    // Get all folders in the base path
    const folders = getFolders(basePath);

    // Process each folder
    folders.forEach(folder => {
        const folderPath = path.join(basePath, folder);
        const files = getFiles(folderPath);

        // Rename files with # symbol
        files.forEach(file => {
            if (file.includes('#')) {
                const oldFilePath = path.join(folderPath, file);
                
                // Extract the filename before the # symbol
                const newFileName = file.split('#')[0];

                // Preserve the file extension if it exists
                const extension = path.extname(file);
                const finalNewFileName = newFileName + extension;

                const newFilePath = path.join(folderPath, finalNewFileName);

                try {
                    fs.renameSync(oldFilePath, newFilePath);
                    console.log(`Renamed: ${file} -> ${finalNewFileName}`);
                } catch (error) {
                    console.error(`Error renaming ${file}:`, error);
                }
            }
        });
    });
}

// Function to get all folders in a base path
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

// Main execution
function main() {
    const basePath = path.join(process.cwd(), 'public', 'odds-wizard');
    
    console.log('Starting file renaming process...');
    renameFilesWithHashSymbol(basePath);
    console.log('File renaming process completed.');
}

// Execute the script
main();