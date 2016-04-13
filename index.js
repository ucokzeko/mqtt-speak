var mqtt = require('mqtt');
var crypto = require('crypto');
var fs = require('fs');
var includes = require('array-includes');
var player = require('play-sound')(opts = {});
var Processor = require('./module/audio-processor.js');

var client = mqtt.connect('mqtt://localhost');
var audioPath = './audio/'; // Audio path needs to be adjusted to the environment
var processor = new Processor();

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
  		console.log('Audio found.');
  		playAudio(md5String);
  	} else {
  		// Request TTS service to generate audio file and save it
  		console.log('Generating audio file.');
  		processor.createAudioFile(message.toString(), audioPath, md5String + ".mp3", function(err, data) {
  			if (err) {
  				console.error('Creating audio file failed.', err);
  			} else {
  				playAudio(md5String);
  			}
  		});
  	}
	console.log('--- Done processing request ---');
});

function playAudio(md5String) {
	player.play(audioPath + "/" + md5String + '.mp3', function(err){
		console.log('Audio played.');
	});
}

function isAudioExist(md5String) {
	var files = fs.readdirSync(audioPath);
	return includes(files, md5String + '.mp3');
}

function getMD5(text) {
	return crypto.createHash('md5').update(text).digest("hex");
}