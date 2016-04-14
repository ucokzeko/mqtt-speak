"use strict";

const fs = require('fs');
const mqtt = require('mqtt');
const config = require('config.json')('./config.json');
const Processor = require('./module/audio-processor.js');

let client = mqtt.connect('mqtt://localhost');

client.on('connect', function () {
	client.subscribe(config.channel.sub);
	
	try {
		fs.lstatSync(config.audio.path);
	} catch (e) {
	    fs.mkdirSync(config.audio.path);
	}
});
 
client.on('message', function (topic, message) {
	console.log('-- Message received ---');
	console.log('Message: ' + message.toString());
	new Processor(message.toString(), config.audio.path, function (error, path) {
		if (error) { 
			console.error("Failed getting audio file.\n", error);
		}
		else {
			client.publish(config.channel.pub, path);
			console.log('Put audio path to playing queue');
		}
	});
});