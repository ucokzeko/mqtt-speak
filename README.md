# mqtt-speak

Node app that listens to MQTT queue on specific topic (can be found in `./src/config.json`) and it will process the string message to either create an audio file using a TTS service and save it locally to specific path or (if exists) just publish an audio path back to MQTT queue

### Setup Basics
- `git clone https://github.com/ucokzeko/mqtt-play.git`
- `npm install`
- Update environment variables
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

### Usage
Run test script `npm test` to test if you set it up properly

or

You can manually publish a message to specified topic with `mosquitto_pub`

For example
`mosquitto_pub -h localhost -t 'say/test' -m 'This is a test audio'`


**Replace acapela login detail to your desired configuration**
