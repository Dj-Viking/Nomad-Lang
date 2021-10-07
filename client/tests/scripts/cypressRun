#!/usr/bin/env bash

echo 'starting headless cypress to run the spec if SPECNAME was * then it will run all specs: ' "$SPECNAME"
$(npm bin)/cypress run --headless --spec "./tests/e2e/specs/$SPECNAME"