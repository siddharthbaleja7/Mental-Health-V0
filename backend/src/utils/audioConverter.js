const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('ffmpeg-static');
ffmpeg.setFfmpegPath(ffmpegPath);
const path = require('path');
const fs = require('fs').promises;

/**
 * Convert audio file to WAV format if needed
 * @param {string} inputPath - Path to the input audio file
 * @returns {Promise<string>} - Path to the WAV file
 */
async function convertToWav(inputPath) {
    // If it's already a WAV file, return the path
    if (path.extname(inputPath).toLowerCase() === '.wav') {
        return inputPath;
    }

    const outputPath = `${inputPath}.wav`;

    return new Promise((resolve, reject) => {
        ffmpeg(inputPath)
            .toFormat('wav')
            .outputOptions('-acodec pcm_s16le')  // Standard WAV format
            .outputOptions('-ar 44100')          // Standard sample rate
            .on('end', () => {
                // Delete the original file and resolve with new path
                fs.unlink(inputPath)
                    .then(() => resolve(outputPath))
                    .catch(err => {
                        console.warn('Failed to delete original file:', err);
                        resolve(outputPath);
                    });
            })
            .on('error', (err) => reject(new Error(`Failed to convert audio: ${err.message}`)))
            .save(outputPath);
    });
}

module.exports = {
    convertToWav
};