function init() {
  process.env.MOSQUITTO_ADDRESS     = 'http://localhost';
  process.env.DETOX_CENTRAL_ADDRESS = 'http://localhost';
  process.env.SPEAK_AUDIO_PATH      = './src/test/';
}

module.exports = {
  init
};
