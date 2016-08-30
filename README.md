# mqtt-speak

Node app that listens to MQTT queue on specific topic (can be found in `./src/config.json`) and it will process the string message to either create an audio file using a TTS service and save it locally to specific path or (if exists) just publish an audio path back to MQTT queue

### Setup Basics
- `git clone https://github.com/ucokzeko/mqtt-play.git`
- `npm install`
- Update environment variables
- `APP_NAME` A name for the service
- `SPEAK_AUDIO_PATH` The path to the audio cache
- `MOSQUITTO_ADDRESS` The address of the MQTT broker
- `DETOX_CENTRAL_ADDRESS` The address used for processing TTS requests
- `TTS_CACHE_SERVE_PORT` The port used to serve audio files
- `npm start`

Required environment variables:
```
export DETOX_CENTRAL_ADDRESS=""
```

These should be automatically provided by the build system

### TTS Service
This app works via the detox central server and your service must have access to that server.

### Notes
You can add `export` to `~/.profile` or `~/.bash_profile` to make it set up automatically during start up

Expected mqtt message format
```
'This is a test audio'
```
The delay between the time a message is received and the time at which the corresponding audio file is played can be set in `./src/support/constants.js`

### Usage
Run test script `npm run integrationTests` to test if you set it up properly
Run test script `npm run unitTests` to perform unit tests

or

You can manually publish a message to specified topic with `mosquitto_pub`

For example
`mosquitto_pub -h localhost -t 'say/test' -m '{ "message": "This is a test audio" }'`
