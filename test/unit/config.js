function init() {
  process.env.MOSQUITTO_ADDRESS     = 'http://localhost';
  process.env.DETOX_CENTRAL_ADDRESS = 'http://localhost';
  process.env.SPEAK_AUDIO_PATH      = './src/test/';
  process.env.TTS_CACHE_SERVER_PORT = '1234';
  process.env.SOX_COMMAND           = 'sox';
  process.env.PREFIX_TONE_FILE      = './';
}

module.exports = {
  init
};
