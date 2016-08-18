const fs     = require('fs');
const crypto = require('crypto');

const ttsProvider = require('./detox-central-tts.js');

function TTSProcessor(message, outputRoot) {
  const outputPath = `${outputRoot}${getMD5String(message)}.mp3`;

  return new Promise((fulfill, reject) => {
    fs.stat(outputPath, (err) => {
      if (err) {
        ttsProvider.fetch(message, outputPath).then((audioPath) => {
          fulfill(audioPath);
        }, reject);
      } else {
        fulfill(outputPath);
      }
    });
  });
}

function getMD5String(text) {
  return crypto.createHash('md5').update(text).digest('hex');
}

module.exports = TTSProcessor;
