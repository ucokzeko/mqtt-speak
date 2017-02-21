const mqtt            = require('mqtt');
const mkdirp          = require('mkdirp');
const winston         = require('winston');
const uri             = require('urijs');
const path            = require('path');
const moment          = require('moment-timezone');
const express         = require('express');
const MqttTransport   = require('winston-mqtt');
const ConfigManager   = require('serenity-sdk').ConfigManager;

const consts       = require('./support/constants');
const TTSProcessor = require('./module/tts-processor');
const isMuteTime   = require('./module/mute-check.js').isMuteTime;

winston.add(MqttTransport, { name: 'mqtt-speak', host: consts.mqttHost });
moment.tz.setDefault(process.env.TZ);

const client        = mqtt.connect(consts.mqttHost);
const app           = express();
const configManager = new ConfigManager();

app.set('port', consts.ttsCacheServerPort);

winston.info(`Audio path:       ${consts.audioPath}`);
winston.info(`Subscribed topic: ${consts.speakTopic}`);
winston.info(`Published topic:  ${consts.playTopic}`);
winston.info(`Hostname:         ${consts.hostname}`);

client.on('connect', () => {
  winston.info('Connected to MQTT Broker. Awaiting messages.');
  client.subscribe(consts.speakTopic);

  mkdirp(consts.audioPath, (err) => {
    if (err) {
      winston.error(err);
    }
  });
  app.use(consts.audioURLPath, express.static(consts.audioPath));

  const server = app.listen(app.get('port'), () => {
    const port = server.address().port;
    winston.info(`Listening on port: '${port}`);
  });
});

client.on('message', (topic, rawMessage) => {
  const message = rawMessage.toString();
  winston.info(`Message received: '${message}'`);

  const muteAt   = configManager.getConfig('silent-period').start;
  const unmuteAt = configManager.getConfig('silent-period').end;
  if (isMuteTime(moment(), muteAt, unmuteAt)) {
    winston.info('Message muted.');
    return;
  }

  let toSpeak;
  let playTimeMilli;
  let playTime;

  try {
    toSpeak       = JSON.parse(message).message;
    playTimeMilli = Number(new Date().getTime()) + consts.playDelay;
    playTime      = new Date(playTimeMilli).toISOString();
  } catch (e) {
    winston.error(`Message attempt failed: ${e}`);
  }

  new TTSProcessor(toSpeak, consts.audioPath)
  .then((filePath) => {
    const fileName  = path.basename(filePath);
    const audioUrl  = buildDownloadUrl(path.join(consts.audioURLPath, fileName));
    const toPublish = JSON.stringify({
      url:      audioUrl,
      name:     fileName,
      time:     playTime,
      location: ['kitchen', 'lounge']
    });
    client.publish(consts.playTopic, toPublish, consts.qos);
    winston.info(`Published audio URL: ${audioUrl}\nTo be played at: ${playTime}`);
  })
  .catch((error) => {
    winston.error(error);
  });
});

// Makes a url to a given served file path
function buildDownloadUrl(downloadPath) {
  const url = uri({
    protocol: 'http',
    hostname: `${consts.hostname}:${consts.ttsCacheServerPort}`,
    path:     downloadPath
  });
  return url.toString();
}
