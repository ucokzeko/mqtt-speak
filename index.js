var mqtt   = require('mqtt');
var crypto = require('crypto');

var client = mqtt.connect('mqtt://localhost');
 
client.on('connect', function () {
  client.subscribe('say/#');
});
 
client.on('message', function (topic, message) {
  // message is Buffer 
  var md5 = crypto.createHash('md5').update(message.toString()).digest("hex");
  console.log(message.toString() + ": " + md5);

});