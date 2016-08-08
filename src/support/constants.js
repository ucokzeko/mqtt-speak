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
const playTopic  = `play/audio`;

module.exports = {
  speakTopic,
  playTopic,
  audioPath,
  mqttHost,
  detoxCentralAddress
};
