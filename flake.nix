{
  nixConfig = {
    extra-trusted-public-keys = "justryanw.cachix.org-1:oan1YuatPBqGNFEflzCmB+iwLPtzq1S1LivN3hUzu60=";
    extra-substituters = "https://justryanw.cachix.org";
  };

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = {
    self,
    nixpkgs,
    flake-utils,
    ...
  }:
    flake-utils.lib.eachDefaultSystem (system: let
      pkgs = import nixpkgs {inherit system;};
      node = pkgs.nodejs_latest;
    in {
      devShells.default = pkgs.mkShell {
        packages = [node];
      };

      packages = {
        default = pkgs.buildNpmPackage {
          name = "lottery";
          src = self;
          buildInputs = [node];
          npmConfigHook = pkgs.importNpmLock.npmConfigHook;

          npmDeps = pkgs.importNpmLock {
            npmRoot = ./.;
          };

          installPhase = ''
            cp -R dist $out
          '';
        };
      };
    });
}
