#! /bin/bash

set -e
SPECLIST="./tests/e2e/ci/CardGameUnit.spec.ts"
$(npm bin)/cypress run --headless --spec "$SPECLIST"
