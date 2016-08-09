{mkService, callPackage, nodejs, mqtt-speak ? callPackage ./release.nix {}, mosquitto}:

mkService rec {
  name = "mqtt-speak";

  user.name = "mqtt-speak";
  user.home = "/var/lib/${user.name}";

  dependsOn = [ mosquitto ];
  environment = {
    SPEAK_AUDIO_PATH = "${user.home}/audio-files/";
  };
    
  script = "
    if [ -d ~/audio-files/ ]
    then
      echo '~/audio-files/ found.'
    else
      mkdir ~/audio-files
    fi

    chmod -R o+rx ~/
    exec ${nodejs}/bin/node --use_strict ${mqtt-speak.build}/lib/node_modules/mqtt-speak/src/index.js
  ";
}
