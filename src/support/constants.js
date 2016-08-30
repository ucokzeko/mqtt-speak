const os = require('os');

function envOrBust(varName) {
  const result = process.env[varName];
  if (!result) {
    throw new Error(`Environment Variable ${varName} is not defined!`);
  }

  return result;
}

function getHostname() {
  let value;
  const ifaces = os.networkInterfaces();
  Object.keys(ifaces).forEach((ifname) => {
    ifaces[ifname].forEach((iface) => {
      if (iface.family !== 'IPv4' || iface.internal) {
        return;
      }
      value = iface.address;
    });
  });
  return value;
}

const audioPath           = envOrBust('SPEAK_AUDIO_PATH');
const mqttHost            = envOrBust('MOSQUITTO_ADDRESS');
const detoxCentralAddress = envOrBust('DETOX_CENTRAL_ADDRESS');
const port                = envOrBust('TTS_CACHE_SERVE_PORT');

const speakTopic   = 'say/#';
const playTopic    = 'play/all';
const audioURLPath = '/audio';
const qos          = 2;
const hostname     = getHostname();

module.exports = {
  speakTopic,
  playTopic,
  qos,
  hostname,
  port,
  audioPath,
  audioURLPath,
  mqttHost,
  detoxCentralAddress
};
