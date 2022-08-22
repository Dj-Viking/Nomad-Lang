#! /bin/bash

set -e

SPECLIST="./tests/e2e/specs/ci/*.spec.ts"
$(npm bin)/cypress run --headless --spec "$SPECLIST"
