var mqtt    = require('mqtt');
var client  = mqtt.connect('mqtt://localhost');
 
client.on('connect', function () {
  client.subscribe('say/#');
});
 
client.on('message', function (topic, message) {
  // message is Buffer 
  console.log(message.toString());
});