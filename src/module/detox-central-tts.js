const auth    = require('detox-node-service-auth-module');
const url     = require('url');
const winston = require('winston');
const request = require('request');
const util    = require('util');
const fs      = require('fs');

const consts  = require('../support/constants');

function fetch(message, path) {
  return new Promise((fulfill, reject) =>  {
    auth.getCentralOptions
    .then((centralOptions) => {
      // copy options for reuse when downloading file
      const options  = Object.assign({}, centralOptions);
      options.json   = { message };
      options.url    = buildURL('tts');
      options.method = 'POST';
      request(options, (err, response, body) => {
        if (err) {
          reject(err);
        } else if (response.statusCode === 200 || response.statusCode === 201) {
          const downloadUrl = buildURL(body.relative_url);
          downloadAudioFile(centralOptions, downloadUrl, path)
          .then((audioPath) => {
            winston.info(`Downloaded Audio: ${downloadUrl}, Path: ${path}`);
            fulfill(audioPath);
          })
          .catch((error) => {
            reject(error);
          });
        } else {
          reject(new Error(`Response is unexpected! ${response.statusCode} : ${util.inspect(body)}`));
        }
      });
    })
    .catch((err) => {
      reject(err);
    });
  });
}

function buildURL(path) {
  const reqUrl = url.parse(consts.detoxCentralAddress);
  reqUrl.pathname = path;
  return reqUrl.format();
}

function downloadAudioFile(options, downloadUrl, path) {
  return new Promise((fulfill, reject) => {
    const requestOptions    = options;
    requestOptions.encoding = 'binary';
    request(downloadUrl, requestOptions, (error, response, body) => {
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
