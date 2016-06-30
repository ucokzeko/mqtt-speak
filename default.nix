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
    deps = [ nodePackages.by-spec."config.json"."0.0.4" nodePackages.by-spec."crypto-js"."3.1.6" nodePackages.by-spec."mkdirp"."^0.5.1" nodePackages.by-spec."mqtt"."1.8.0" nodePackages.by-spec."request"."2.71.0" nodePackages.by-spec."urijs"."1.16.1" nodePackages.by-spec."winston"."2.2.0" ];
    peerDependencies = [];
  };
  dev = build.override {
    buildInputs = build.buildInputs ++ [ nodePackages.by-spec."eslint"."^2.8.0" nodePackages.by-spec."eslint-config-airbnb"."^7.0.0" nodePackages.by-spec."eslint-plugin-jsx-a11y"."^0.6.2" nodePackages.by-spec."eslint-plugin-react"."^4.3.0" ];
  };
}