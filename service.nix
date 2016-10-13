{mkService, callPackage, nodejs, sox, lame, mqtt-speak ? callPackage ./release.nix {}, mosquitto}:

let
  user.name = "mqtt-speak";
  user.home = "/var/lib/${user.name}";
  mqttSpeakDir = "${mqtt-speak.build}/lib/node_modules/mqtt-speak";
in mkService {
  inherit user;
  name = "mqtt-speak";
  dependsOn = [ mosquitto ];
  environment = {
    SOX_COMMAND = "${sox.override { inherit lame; enableLame = true; }}/bin/sox";
    SPEAK_AUDIO_PATH = "${user.home}/audio-files/";
    PREFIX_TONE_FILE = "${user.home}/audio-files/notify.mp3";
  };

  preStartRootScript = ''
    if [ -d $SPEAK_AUDIO_PATH ]
    then
      echo '$SPEAK_AUDIO_PATH found.'
    else
      mkdir $SPEAK_AUDIO_PATH
      chown ${user.name}: $SPEAK_AUDIO_PATH
    fi

    if [ -e $PREFIX_TONE_FILE ]
    then
      echo '$PREFIX_TONE_FILE found.'
    else
      cp ${mqttSpeakDir}/src/support/audio/notify.mp3 $PREFIX_TONE_FILE
      chown ${user.name}: $PREFIX_TONE_FILE
    fi
  '';

  script = ''
    exec ${nodejs}/bin/node --use_strict ${mqtt-speak.build}/lib/node_modules/mqtt-speak/src/app.js
  '';
}
