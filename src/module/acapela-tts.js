const fs      = require('fs');
const request = require('request');
const uri     = require('urijs');
const winston = require('winston');

const config = require('config.json')(`${__dirname}/../config.json`);

function fetch(audioText, path) {
  return new Promise((fulfill, reject) =>  {
    request(getTTSRequestUrl(audioText), (error, response, body) => {
      if (error) {
        reject(error);
      } else {
        if (response.statusCode === 200) {
          // Unescape url
          const audioUrl = JSON.parse(body).snd_url.replace('\\', '');
          downloadAudioFile(audioUrl, path)
          .then((audioPath) => {
            fulfill(audioPath);
          }, reject);
        } else {
          reject(new Error(`Response is unexpected: ${response.statusCode}`));
        }
      }
    });
  });
}

function getTTSRequestUrl(reqText) {
  const url = uri({
    protocol: 'http',
    hostname: 'vaas.acapela-group.com',
    path:     'Services/UrlMaker.json'
  });
  const data = {
    req_voice:    config.acapela.voice,
    req_text:     reqText,
    prot_vers:    '2',
    cl_login:     process.env.ACAPELA_TTS_LOGIN,
    cl_app:       process.env.ACAPELA_TTS_APP,
    cl_pwd:       process.env.ACAPELA_TTS_PWD,
    req_asw_type: 'SOUND'
  };
  url.query(uri.buildQuery(data));
  return url.toString();
}

function downloadAudioFile(url, path) {
  return new Promise((fulfill, reject) => {
    request(url, { encoding: 'binary' }, (error, response, body) => {
      if (error) {
        reject(error);
      } else {
        if (response.statusCode === 200) {
          fs.writeFile(path, body, 'binary', (err) => {
            if (err) {
              reject(err);
            }
            winston.info(`Audio file saved to ${path}`);
            fulfill(path);
          });
        } else {
          reject(error);
        }
      }
    });
  });
}

module.exports = { fetch };
