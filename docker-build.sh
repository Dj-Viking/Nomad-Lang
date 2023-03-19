#! /bin/bash

# build docker container
docker build . -t dj-viking/nomad-lang-cypress

# connect to container in interactive shell mode
#  docker run -it --entrypoint /bin/bash dj-viking/nomad-lang-cypress