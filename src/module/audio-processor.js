const fs = require('fs');
const crypto = require('crypto');
const Acapela = require(`${__dirname}/acapela-tts.js`);

function Proc(msgString, root) {
  const path = `${root}${getMD5String(msgString)}.mp3`;
  return new Promise((fulfill, reject) => {
    try {
      fs.lstatSync(path);
      fulfill(path);
    } catch (e) {
      // Request TTS service to get download url
      new Acapela(msgString, path)
      .then((audioPath) => {
        fulfill(audioPath);
      }, reject);
    }
  });
}

function getMD5String(text) {
  return crypto.createHash('md5').update(text).digest('hex');
}

module.exports = Proc;
