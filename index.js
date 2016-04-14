var mqtt = require('mqtt');
var crypto = require('crypto');
var fs = require('fs');
var Processor = require('./module/audio-processor.js');
var config = require('config.json')('./config.json');

var client = mqtt.connect('mqtt://localhost');

client.on('connect', function () {
  	client.subscribe(config.channel.sub);
  	
  	try {
		fs.lstatSync(config.audio.path);
  	} catch (e) {
	    fs.mkdirSync(config.audio.path);
	}
});
 
client.on('message', function (topic, message) {
	var md5String = getMD5(message.toString());
	var filename = md5String + ".mp3";
  	console.log('--- Start processing request for: ' + message.toString() + " (" + md5String + ") ---");
  	new Processor(message.toString(), config.audio.path, filename, function (error, path) {
  		if (error) { console.error ("Failed getting audio file.\n", e); }
  		else { client.publish(config.channel.pub, path); }
  	});
});

function getMD5(text) {
	return crypto.createHash('md5').update(text).digest("hex");
}