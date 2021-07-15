# docker build -t language-bench-debian/perf -f Dockerfile.debian.perf .
docker build -t language-bench-nix/perf -f Dockerfile.nix.perf .
LANGUAGE=$1

docker build -t language-bench-nix/$LANGUAGE -f ./docker/nix/Dockerfile.nix.$LANGUAGE.docker .


