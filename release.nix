{ pkgs ? import <nixpkgs> {}
, mqtt-speak ? ./. }:

let
  pkg = pkgs.callPackage mqtt-speak {};
in rec {
  inherit (pkg) tarball build;

  # Will be run in a container with all Detox services running
  integrationTest = ''
    echo NOTE: No integration tests for mqtt-speak.
  '';
}
