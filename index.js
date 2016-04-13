var mqtt = require('mqtt');
var crypto = require('crypto');
var fs = require('fs');
var includes = require('array-includes');
var player = require('play-sound')(opts = {});
var Processor = require('./module/audio-processor.js');
var config = require('config.json')('./config.json');

var client = mqtt.connect('mqtt://localhost');
var processor = new Processor();

client.on('connect', function () {
  	client.subscribe(config.channel.sub);
  	
	if (!fs.existsSync(config.audio.path)){
	    fs.mkdirSync(config.audio.path);
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
  		processor.createAudioFile(message.toString(), config.audio.path, md5String + ".mp3", function(err, data) {
  			if (err) {
  				console.error('Creating audio file failed.\n', err);
  			} else {
  				playAudio(md5String);
  			}
  		});
  	}
	console.log('--- Done processing request ---');
});

function playAudio(md5String) {
	player.play(config.audio.path + "/" + md5String + '.mp3', function(err){
		console.log('Audio played.');
	});
}

function isAudioExist(md5String) {
	var files = fs.readdirSync(config.audio.path);
	return includes(files, md5String + '.mp3');
}

function getMD5(text) {
	return crypto.createHash('md5').update(text).digest("hex");
}