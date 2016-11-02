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
  try {
    const ifaces = os.networkInterfaces();
    Object.keys(ifaces).forEach((ifname) => {
      ifaces[ifname].forEach((iface) => {
        if (iface.family !== 'IPv4' || iface.internal) {
          return;
        }
        value = iface.address;
      });
    });
  } catch (error) {
    if (error.code === 'EPROTONOSUPPORT') {
      value = '127.0.0.1';
    } else {
      throw error;
    }
  }
  return value;
}

const prefixTone          = envOrBust('PREFIX_TONE_FILE');
const soxCommand          = envOrBust('SOX_COMMAND');
const audioPath           = envOrBust('SPEAK_AUDIO_PATH');
const mqttHost            = envOrBust('MOSQUITTO_ADDRESS');
const ttsCacheServerPort  = envOrBust('TTS_CACHE_SERVER_PORT');
const detoxApiAddress     = envOrBust('DETOX_API_ADDRESS');
let detoxCentralAddress   = envOrBust('DETOX_CENTRAL_ADDRESS');

if (process.env.INTEGRATION_TESTING) {
  detoxCentralAddress = 'http://localhost:3001';
}


const speakTopic   = 'say/#';
const playTopic    = 'play/all';
const audioURLPath = '/audio';
const qos          = 2;
const hostname     = getHostname();
const playDelay    = 2000;

module.exports = {
  prefixTone,
  speakTopic,
  playTopic,
  qos,
  hostname,
  playDelay,
  ttsCacheServerPort,
  soxCommand,
  audioPath,
  audioURLPath,
  mqttHost,
  detoxCentralAddress,
  detoxApiAddress
};
