const fs       = require('fs');
const crypto   = require('crypto');
const execFile = require('child_process').execFile;
const consts   = require('../support/constants');

const ttsProvider = require('./detox-central-tts');

function TTSProcessor(message, outputRoot) {
  const speakHash = getMD5String(message);
  const speakPath = `${outputRoot}${speakHash}.mp3`;

  return new Promise((fulfill, reject) => {
    getSpeakAudio(message, speakPath)
    .then(() => getMD5File(consts.prefixTone))
    .then((hash) => {
      const outputPath = `${outputRoot}${hash.read()}${speakHash}.mp3`;
      return getPrefixedSpeakAudio(speakPath, outputPath);
    })
    .then((audioPath) => {
      fulfill(audioPath);
    })
    .catch((err) => {
      reject(err);
    });
  });
}

function getMD5String(text) {
  return crypto.createHash('md5').update(text).digest('hex');
}

function getMD5File(file) {
  return new Promise((fulfill) => {
    const fd = fs.createReadStream(file);
    const hash = crypto.createHash('md5');
    hash.setEncoding('hex');

    fd.on('end', () => {
      hash.end();
      fulfill(hash);
    });

    fd.pipe(hash);
  });
}

function getSpeakAudio(message, speakPath) {
  return new Promise((fulfill, reject) => {
    fs.stat(speakPath, (err) => {
      if (err) {
        ttsProvider.fetch(message, speakPath).then((audioPath) => {
          fulfill(audioPath);
        }, reject);
      } else {
        fulfill(speakPath);
      }
    });
  });
}

function getPrefixedSpeakAudio(speakPath, outputPath) {
  return new Promise((fulfill, reject) => {
    fs.stat(outputPath, (err) => {
      if (err) {
        execFile(consts.soxCommand, [consts.prefixTone, speakPath, outputPath], (error) => {
          if (error) {
            reject(error);
          }
          fulfill(outputPath);
        });
      } else {
        fulfill(outputPath);
      }
    });
  });
}

module.exports = TTSProcessor;
