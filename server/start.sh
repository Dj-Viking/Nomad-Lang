#! /bin/bash

PROD="production"

if [ "$NODE_ENV" = "$PROD" ]; then
  # check if dist folder exists run server 
  # if not run tsc; then node dist/index.js
  if [ -d "dist" ]; then
    node dist/index.js
  elif ! [ -d "dist" ]; then
    npm run tsc; node dist/index.js;
  fi

elif ! [ "$NODE_ENV" = "$PROD" ]; then
  # we are doing dev on the server; start in dev mode
  npm run dev;
fi