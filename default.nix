{ mqtt-speak ? { outPath = ./.; name = "mqtt-speak"; }
, pkgs ? import <nixpkgs> {}
}:
let
  nodePackages = import "${pkgs.path}/pkgs/top-level/node-packages.nix" {
    inherit pkgs;
    inherit (pkgs) stdenv nodejs fetchurl fetchgit;
    neededNatives = [ pkgs.python ] ++ pkgs.lib.optional pkgs.stdenv.isLinux pkgs.utillinux;
    self = nodePackages;
    generated = ./package.nix;
  };
in rec {
  tarball = pkgs.runCommand "mqtt-speak-0.0.1.tgz" { buildInputs = [ pkgs.nodejs ]; } ''
    mv `HOME=$PWD npm pack ${mqtt-speak}` $out
  '';
  build = nodePackages.buildNodePackage {
    name = "mqtt-speak-0.0.1";
    src = [ tarball ];
    buildInputs = nodePackages.nativeDeps."mqtt-speak" or [];
    deps = [ nodePackages.by-spec."mkdirp"."^0.5.1" nodePackages.by-spec."mqtt"."1.8.0" nodePackages.by-spec."request"."2.71.0" nodePackages.by-spec."winston"."2.2.0" nodePackages.by-spec."url-parse"."1.1.6" nodePackages.by-spec."fs-extra"."0.30.0" nodePackages.by-spec."express"."^4.13.3" nodePackages.by-spec."mocha"."^2.5.3" nodePackages.by-spec."rewire"."2.5.1" nodePackages.by-spec."valid-url"."1.0.9" nodePackages.by-spec."urijs"."1.16.1" nodePackages.by-spec."detox-node-service-auth-module"."git+ssh://git@github.com/dstil/detox-node-service-auth-module.git" ];
    peerDependencies = [];
  };
  dev = build.override {
    buildInputs = build.buildInputs ++ [ nodePackages.by-spec."eslint"."^2.8.0" nodePackages.by-spec."eslint-config-airbnb"."^7.0.0" nodePackages.by-spec."eslint-plugin-jsx-a11y"."^0.6.2" nodePackages.by-spec."eslint-plugin-react"."^4.3.0" ];
  };
}