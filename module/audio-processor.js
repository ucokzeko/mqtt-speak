var fs = require('fs');
var request = require('request');

var Proc = function() {};

Proc.prototype.createAudioFile = function(messageString, audioPath, fileName, callback) {
	request(getTTSRequestUrl(messageString), function (error, response, body) {
	    if (!error && response.statusCode == 200) {
	    	var audioUrl = JSON.parse(body).snd_url.replace('\\','');
	        console.log('Audio url: ' + audioUrl); // Show download link.
	        downloadAudioFile(audioUrl, audioPath, fileName, function(err, data) {
  				if (err) { return callback(err); }
  				callback(null, data);
	        });
	    } else { return callback(error); }
	});
}

function getTTSRequestUrl(reqText) {
	var baseUrl = 'http://vaas.acapela-group.com/Services/UrlMaker.json';
	return baseUrl + '?req_voice=lisa22k&req_text="' + reqText + '"&prot_vers=2&cl_login=EVAL_VAAS&cl_app=EVAL_3608771&cl_pwd=du40md9t&req_asw_type=SOUND'
}

function downloadAudioFile(audioUrl, audioPath, fileName, callback) {
	request(audioUrl, {encoding: 'binary'}, function(error, response, body) {
  		fs.writeFile(audioPath + fileName, body, 'binary', function(err) {
  			if (err) { return callback(err); }
			console.log('Audio file saved.');
			callback (null, true);
  		});
	});
}

module.exports = Proc;