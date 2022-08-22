#! /bin/bash

set -e

echo "$(pwd)"

SPECLIST="./tests/e2e/specs/ci/CardGameUnit.spec.ts"
$(npm bin)/cypress run --headless --spec "$SPECLIST"
