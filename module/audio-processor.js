var fs = require('fs');
var request = require('request');
var includes = require('array-includes');

var Proc = function(msgString, path, filename, callback) {
	if (isFileExist(path, filename)) {
  		// TODO: Action when audio file is found
  		console.log('Audio found.');
  		callback(null, path + filename)
  	} else {
  		// Request TTS service to generate audio file and save it
		request(getTTSRequestUrl(msgString), function (error, response, body) {
			if (error) { return callback(error, ''); }
			else {
				if (response.statusCode == 200) {
			    	var audioUrl = JSON.parse(body).snd_url.replace('\\','');
			        console.log('Audio url: ' + audioUrl); // Show download link.
			        downloadAudioFile(audioUrl, path, filename, function(err, data) {
		  				if (err) { return callback(err, ''); }
		  				callback(null, data);
		        	});
			    } else { return callback(new Error('Response is unexpected: ' + response.statusCode), null); }
			}
		})
  	}
};

function isFileExist(path, filename) {
	var files = fs.readdirSync(path);
	return includes(files, filename);
}

function getTTSRequestUrl(reqText) {
	var baseUrl = 'http://vaas.acapela-group.com/Services/UrlMaker.json';
	return baseUrl + '?req_voice=lisa22k&req_text="' + reqText + '"&prot_vers=2&cl_login=EVAL_VAAS&cl_app=EVAL_3608771&cl_pwd=du40md9t&req_asw_type=SOUND'
}

function downloadAudioFile(url, path, filename, callback) {
	request(url, {encoding: 'binary'}, function(error, response, body) {
  		fs.writeFile(path + filename, body, 'binary', function(err) {
  			if (err) { return callback(err, ''); }
			console.log('Audio file saved.');
			callback (null, path + filename);
  		});
	});
}

module.exports = Proc;