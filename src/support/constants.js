const os = require('os');

function envOrBust(varName) {
  const result = process.env[varName];
  if (!result) {
    throw new Error(`Environment Variable ${varName} is not defined!`);
  }

  return result;
}

function getHostname() {
  const ifaces = os.networkInterfaces();
  Object.keys(ifaces).forEach((ifname) => {
    ifaces[ifname].forEach((iface) => {
      if (iface.family !== 'IPv4' || iface.internal !== false) {
        return;
      }
      hostname = iface.address;
    });
  });
}

const audioPath           = envOrBust('SPEAK_AUDIO_PATH');
const mqttHost            = envOrBust('MOSQUITTO_ADDRESS');
const detoxCentralAddress = envOrBust('DETOX_CENTRAL_ADDRESS');

const speakTopic = 'say/#';
const playTopic  = 'play/all';
let hostname     = '';
getHostname();
const port       = 3002;

module.exports = {
  speakTopic,
  playTopic,
  hostname,
  port,
  audioPath,
  mqttHost,
  detoxCentralAddress
};
