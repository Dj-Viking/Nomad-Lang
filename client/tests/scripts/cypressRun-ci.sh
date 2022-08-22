#! /bin/bash

set -e
SPECLIST="./tests/e2e/ci/*"
$(npm bin)/cypress run --headless --spec "$SPECLIST"
