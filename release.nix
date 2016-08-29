{ pkgs ? import <nixpkgs> {}
, mqtt-speak ? ./. }:

let
  pkg = pkgs.callPackage mqtt-speak {};
  buildTools = pkgs.callPackage ./build_scripts/build.nix { doNotBrowsify = ["request"];};
in rec {
  inherit (pkg) tarball;

  build = pkgs.lib.overrideDerivation pkg.build (o: {
    # Can't just test here because we don't have devDependencies
    checkPhase = ''
      [ -e ${test} ]
    '';
    doCheck = true;
  }) // buildTools.detoxNodePackage pkg;

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
    INTEGRATION_TESTING=1 DETOX_CENTRAL_ADDRESS=http://localhost:3001 ${pkgs.nodejs}/bin/npm run integrationTests
  '';
}
