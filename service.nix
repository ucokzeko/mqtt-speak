{mkService, callPackage, nodejs, mqtt-speak ? callPackage ./release.nix {}, mosquitto}:

mkService {
  name = "mqtt-speak";
  dependsOn = [ mosquitto ];
  environment = {
    ACAPELA_TTS_LOGIN = "YOUR_LOGIN";
    ACAPELA_TTS_APP = "YOUR_APP";
    ACAPELA_TTS_PWD = "YOUR_PWD";
    SPEAK_AUDIO_PATH = "/tmp/mqtt-speak/";
  };
  script = "exec ${nodejs}/bin/node --use_strict ${mqtt-speak.build}/lib/node_modules/mqtt-speak/src/index.js";
}
