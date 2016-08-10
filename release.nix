{ pkgs ? import <nixpkgs> {}
, mqtt-speak ? ./. }:

let
  pkg = pkgs.callPackage mqtt-speak {};
in rec {
  inherit (pkg) tarball;

  build = pkgs.lib.overrideDerivation pkg.build (o: {
    # Can't just test here because we don't have devDependencies
    checkPhase = ''
      [ -e ${test} ]
    '';
    doCheck = true;
  });

  test = pkgs.lib.overrideDerivation pkg.dev (o: {
    name = "${o.name}-test";
    checkPhase = ''
      export DETOX_CENTRAL_ADDRESS=http://localhost:3001 
      export MOSQUITTO_ADDRESS=mqtt://localhost:1883
      export SPEAK_AUDIO_PATH=~/test/
      npm run lint
      npm run unitTests
    '';
    doCheck = true;
  });

  # Will be run in a container with all Detox services running
  integrationTest = ''
    cd ${test}/lib/node_modules/mqtt-speak
    INTEGRATION_TESTING=1 ${pkgs.nodejs}/bin/npm run integrationTests
  '';
}
