"use strict";

const fs = require('fs');
const crypto = require('crypto');
const request = require('request');
const URI = require('urijs');

var Proc = function(msgString, root) {
  const path = root + getMD5String(msgString) + '.mp3';

  console.log('MD5 String: ' + getMD5String(msgString));
  console.log('Audio path: ' + path);

  return new Promise(function (fulfill, reject) {
    try {
      fs.lstatSync(path);
      console.log('Audio found');
      fulfill(path);
    } catch (e) {
      // Request TTS service to get download url
      request(getTTSRequestUrl(msgString), function (error, response, body) {
        if (error) {
          reject(error);
        } else {
          if (response.statusCode === 200) {
            // Unescape url
            const audioUrl = JSON.parse(body).snd_url.replace('\\','');
            console.log('Audio url: ' + audioUrl); // Show download link.
            downloadAudioFile(audioUrl, path)
            .then(function (path) {
              fulfill(path);
            }, reject);
          } else {
            reject(new Error('Response is unexpected: ' + response.statusCode));
          }
        }
      });
    }
  });
};

function getMD5String(text) {
  return crypto.createHash('md5').update(text).digest("hex");
}

function getTTSRequestUrl(reqText) {
  let uri = URI({
    protocol: 'http',
    hostname: 'vaas.acapela-group.com',
    path: 'Services/UrlMaker.json',
  });
  const data = {
    req_voice: 'lisa22k',
    req_text: reqText,
    prot_vers: '2',
    cl_login: 'EVAL_VAAS',
    cl_app: 'EVAL_3608771',
    cl_pwd: 'du40md9t',
    req_asw_type: 'SOUND'
  };
  uri.query(URI.buildQuery(data));
  return uri.toString();
}

function downloadAudioFile(url, path) {
  return new Promise(function (fulfill, reject) {
    request(url, {encoding: 'binary'}, function(error, response, body) {
      if (error) {
        reject(error);
      } else {
        if (response.statusCode === 200) {
          fs.writeFile(path, body, 'binary', function(err) {
            if (err) {
              reject(err);
            }
            console.log('Audio file saved');
            fulfill(path);
          });
        } else {
          reject (error);
        }
      }
    });
  });
}

module.exports = Proc;