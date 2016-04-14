"use strict";

const fs = require('fs');
const crypto = require('crypto');
const request = require('request');

var Proc = function(msgString, root, callback) {
	const path = root + getMD5String(msgString) + '.mp3';

	console.log('MD5 String: ' + getMD5String(msgString));
	console.log('Audio path: ' + path);

	try {
		(fs.lstatSync(path));
  		console.log('Audio found');
  		callback(null, path)
	} catch (e) {
		request(getTTSRequestUrl(msgString), function (error, response, body) {
			if (error) { return callback(error, ''); }
			else {
				if (response.statusCode == 200) {
			    	var audioUrl = JSON.parse(body).snd_url.replace('\\','');
			        console.log('Audio url: ' + audioUrl); // Show download link.
		  				if (err) { return callback(err, ''); }
			        downloadAudioFile(audioUrl, path, function(err, data) {
		  				callback(null, data);
		        	});
			    } else { return callback(new Error('Response is unexpected: ' + response.statusCode), null); }
			}
		})
  	}
};

function getMD5String(text) {
	return crypto.createHash('md5').update(text).digest("hex");
}

function getTTSRequestUrl(reqText) {
	const baseUrl = 'http://vaas.acapela-group.com/Services/UrlMaker.json';
	return baseUrl + '?req_voice=lisa22k&req_text="' + reqText + '"&prot_vers=2&cl_login=EVAL_VAAS&cl_app=EVAL_3608771&cl_pwd=du40md9t&req_asw_type=SOUND'
}

function downloadAudioFile(url, path, callback) {
	request(url, {encoding: 'binary'}, function(error, response, body) {
  			if (err) { return callback(err, ''); }
  		fs.writeFile(path, body, 'binary', function(err) {
			console.log('Audio file saved.');
			callback(null, path);
  		});
	});
}

module.exports = Proc;