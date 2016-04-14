var mqtt = require('mqtt');
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
  		if (error) { console.error ("Failed getting audio file.\n", e); }
  		else { client.publish(config.channel.pub, path); }
  	console.log('-- Message received ---');
  	console.log('Message: ' + message.toString());
  	new Processor(message.toString(), config.audio.path, function (error, path) {
  	});
