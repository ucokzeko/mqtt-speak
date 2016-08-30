{mkService, callPackage, nodejs, mqtt-speak ? callPackage ./release.nix {}, mosquitto}:
let
  executionPath = ''${mqtt-speak.build}/lib/node_modules/mqtt-speak'';
in mkService rec {
  name = "mqtt-speak";

  user.name = "mqtt-speak";
  user.home = "/var/lib/${user.name}";

  dependsOn = [ mosquitto ];
  environment = {
    SPEAK_AUDIO_PATH = "${user.home}/audio-files/";
  };

  script = ''
    if [ -d $SPEAK_AUDIO_PATH ]
    then
      echo '$SPEAK_AUDIO_PATH found.'
    else
      mkdir $SPEAK_AUDIO_PATH
    fi

    cd ${executionPath}
    exec ${nodejs}/bin/node --use_strict ${executionPath}/dist/app.js
  '';
}
