#! /bin/bash

PROD="production"

if [ "$NODE_ENV" = "$PROD" ]; then
  npm start;
elif ! [ "$NODE_ENV" = "$PROD" ]; then
  npm run concurrently;
fi