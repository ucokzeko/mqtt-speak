var mqtt = require('mqtt');
var crypto = require('crypto');
var request = require('request');
var fs = require('fs');
var includes = require('array-includes');


var client = mqtt.connect('mqtt://localhost');
var audioPath = 'audio'; // Audio path needs to be adjusted to the environment

client.on('connect', function () {
  	client.subscribe('say/#');

	if (!fs.existsSync(audioPath)){
	    fs.mkdirSync(audioPath);
	}
});
 
client.on('message', function (topic, message) {
	var md5String = getMD5(message.toString());
  	console.log(message.toString() + ": " + md5String);
  	if (isAudioExist(md5String)) {
  		// TODO: Action when audio file is found
  		console.log('Audio found.')
  	} else {
  		// Request TTS service to generate audio file and save it
  		console.log('Generating audio file');
  		request(getTTSRequestUrl(message.toString()), function (error, response, body) {
		    if (!error && response.statusCode == 200) {
		    	var audioUrl = JSON.parse(body).snd_url.replace('\\','');
		        console.log('Audio url: ' + audioUrl); // Show download link.
		        request(audioUrl, {encoding: 'binary'}, function(error, response, body) {
			  		fs.writeFile('audio/' + md5String + '.mp3', body, 'binary', function(err) {
			  			if (err) {
							console.error('Failed saving audio file!', e);
			  			} else {
			  				console.log('Audio file saved.');
			  			}
			  		});
				});
		    } else {
		    	console.error("Error requesting audio file!", e);
		    }
		});
  	}
});

function getTTSRequestUrl(reqText) {
	var baseUrl = 'http://vaas.acapela-group.com/Services/UrlMaker.json';
	return baseUrl + '?req_voice=lisa22k&req_text="' + reqText + '"&prot_vers=2&cl_login=EVAL_VAAS&cl_app=EVAL_3608771&cl_pwd=du40md9t&req_asw_type=SOUND'
}

function isAudioExist(md5String) {
	var files = fs.readdirSync(audioPath);
	return includes(files, md5String + '.mp3');
}

function getMD5(text) {
	return crypto.createHash('md5').update(text).digest("hex");
}