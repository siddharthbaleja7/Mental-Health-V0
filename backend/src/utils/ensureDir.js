const fs = require('fs').promises;
const path = require('path');

async function ensureDir(dirPath) {
    try {
        await fs.access(dirPath);
    } catch (error) {
        // Directory doesn't exist, create it
        await fs.mkdir(dirPath, { recursive: true });
    }
}

module.exports = { ensureDir };