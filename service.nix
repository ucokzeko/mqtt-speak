{mkService, callPackage, nodejs, mqtt-speak ? callPackage ./release.nix {}, mosquitto}:

mkService {
  name = "mqtt-speak";
  dependsOn = [ mosquitto ];
  environment = {
    SPEAK_AUDIO_PATH = "/tmp/mqtt-speak/";
  };
  user.name = "mqtt-speak";
  script = "exec ${nodejs}/bin/node --use_strict ${mqtt-speak.build}/lib/node_modules/mqtt-speak/src/index.js";
}
