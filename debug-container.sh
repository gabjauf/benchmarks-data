#!/bin/sh
LANGUAGE_NAME=$1

docker run -it --cap-add SYS_ADMIN --entrypoint sh -v $(pwd)/results:/app/results language-bench-nix/$LANGUAGE_NAME