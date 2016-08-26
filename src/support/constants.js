function envOrBust(varName) {
  const result = process.env[varName];
  if (!result) {
    throw new Error(`Environment Variable ${varName} is not defined!`);
  }

  return result;
}

const audioPath           = envOrBust('SPEAK_AUDIO_PATH');
const mqttHost            = envOrBust('MOSQUITTO_ADDRESS');
const detoxCentralAddress = envOrBust('DETOX_CENTRAL_ADDRESS');

const speakTopic = 'say/#';
const playTopic  = 'play/multi';
const hostname   = '10.149.74.49';
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
