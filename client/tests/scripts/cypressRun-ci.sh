#! /bin/bash

set -e

ENV_ARGS="TAKE_SCREENSHOTS=yes"

if [ "$1" = "ci" ]; then
    ENV_ARGS="TAKE_SCREENSHOTS=no"
fi

SPECLIST="./tests/e2e/specs/ci/*.spec.ts"
$(npm bin)/cypress run --headless --spec "$SPECLIST" --env $ENV_ARGS

killall node
exit 0
