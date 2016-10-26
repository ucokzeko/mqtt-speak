const fs      = require('fs');
const winston = require('winston');
const request = require('request');
const parse   = require('url-parse');
const util    = require('util');

const consts = require('../support/constants');
const auth   = require('detox-node-service-auth-module');

function fetch(message, path) {
  return new Promise((fulfill, reject) =>  {
    auth.getCentralOptions
    .then((centralOptions) => {
      const options  = Object.assign({}, centralOptions);
      options.json   = { message };
      options.url    = buildURL('tts');
      options.method = 'POST';
      request(options, (err, response, body) => {
        if (err) {
          reject(err);
        } else if (response.statusCode === 200 || response.statusCode === 201) {
          const downloadUrl = buildURL(body.relative_url);
          downloadAudioFile(centralOptions, downloadUrl, path).then((audioPath) => { fulfill(audioPath); }, reject);
        } else {
          reject(new Error(`Response is unexpected! ${response.statusCode} : ${util.inspect(body)}`));
        }
      });
    });
  });
}

function buildURL(path) {
  const url = parse(consts.detoxCentralAddress, true);
  url.set('pathname', `/${path}`);
  return url.toString();
}

function downloadAudioFile(options, url, path) {
  return new Promise((fulfill, reject) => {
    const requestOptions    = options;
    requestOptions.encoding = 'binary';
    request(url, requestOptions, (error, response, body) => {
      if (error) {
        reject(error);
      } else if (response.statusCode === 200) {
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
    });
  });
}

module.exports = { fetch };
