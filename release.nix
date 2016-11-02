{ pkgs ? import <nixpkgs> {}
, mqtt-speak ? ./. }:

let
  pkg = pkgs.callPackage mqtt-speak {};
  buildTools = pkgs.callPackage ./build_scripts/build.nix { doNotBrowsify = [ "express" "request" ]; doNotDelete = ["audio-files"]; };
in rec {
  inherit (pkg) tarball;

  customBuild = pkgs.lib.overrideDerivation pkg.build (o: {
    # Can't just test here because we don't have devDependencies
    checkPhase = ''
      [ -e ${test} ]
    '';
    doCheck = true;
  });

  build = customBuild // buildTools.detoxNodePackage pkg;


  test = pkgs.lib.overrideDerivation pkg.dev (o: {
    name = "${o.name}-test";
    checkPhase = ''
      npm run lint
      npm run unitTests
    '';
    doCheck = true;
  });

  # Will be run in a container with all Detox services running
  integrationTest = ''
    cd ${test}/lib/node_modules/mqtt-speak

    ${pkgs.nodejs}/bin/node --use_strict ./test/integration/host.js &

    export SPEAK_AUDIO_PATH=/var/lib/mqtt-speak/audio-files/
    export PREFIX_TONE_FILE=/var/lib/mqtt-speak/audio-files/notify.mp3
    export SOX_COMMAND=/usr/bin/sox
    ${test}/lib/node_modules/mqtt-speak/node_modules/mocha/bin/mocha --use_strict ./test/integration/test_module/
  '';
}
