{
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem
      (system:
        let pkgs = nixpkgs.legacyPackages.${system};
            packageName = "strictly";
        in {
          packages.${packageName} = pkgs.haskellPackages.callCabal2nix packageName self rec {};
          defaultPackage = self.packages.${system}.${packageName};

          devShell = pkgs.mkShell {
            buildInputs = [
              pkgs.nodejs
              pkgs.yarn
              pkgs.nodePackages.typescript-language-server
            ];
          };
        }
      );
}

