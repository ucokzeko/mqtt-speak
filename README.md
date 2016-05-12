# mqtt-speak

Node app that listens to MQTT queue on specific topic (can be found in `./src/config.json`) and it will process the string message to either create an audio file using a TTS service and save it locally to specific path or (if exists) just publish an audio path back to MQTT queue

### Setup Basics
- `git clone https://github.com/ucokzeko/mqtt-play.git`
- `npm install`
- Update environment variables
- `npm start`

Required environment variable
```
export ACAPELA_TTS_LOGIN="login"
export ACAPELA_TTS_APP="app id"
export ACAPELA_TTS_PWD="password"
```

### TTS Service
This app is currently only support `acapela-group` 

You need to get API access information to be able to use this app

More information can be found on (http://www.acapela-group.com/)

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