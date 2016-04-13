var mqtt   = require('mqtt');
var crypto = require('crypto');

var client = mqtt.connect('mqtt://localhost');
 
client.on('connect', function () {
  client.subscribe('say/#');
});
 
client.on('message', function (topic, message) {
  // message is Buffer 
	var md5String = getMD5(message.toString());
  	console.log(message.toString() + ": " + md5String);

});function getMD5(text) {
	return crypto.createHash('md5').update(text).digest("hex");
}