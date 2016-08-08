{mkService, callPackage, nodejs, mqtt-speak ? callPackage ./release.nix {}, mosquitto}:

mkService rec {
  name = "mqtt-speak";

  user.name = "mqtt-speak";
  user.home = "/var/lib/${user.name}";

  dependsOn = [ mosquitto ];
  environment = {
    SPEAK_AUDIO_PATH = "/var/lib/${user.name}/audio-files/";
  };
    
  script = "
    if [ -d /var/lib/${user.name}/audio-files/ ]
    then
      echo '/var/lib/${user.name}/audio-files/ found.'
    else
      mkdir /var/lib/${user.name}/audio-files
    fi

    chmod -R o+rx ~/
    exec ${nodejs}/bin/node --use_strict ${mqtt-speak.build}/lib/node_modules/mqtt-speak/src/index.js
  ";
}
