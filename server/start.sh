#! /bin/bash

PROD="production"

if [ "$NODE_ENV" = "$PROD" ]; then
  echo 'check if dist folder exists run server' 
  echo 'if not run tsc; then node dist/index.js'
  if [ -d "dist" ]; then
  echo 'start node process'
    node dist/index.js
  elif ! [ -d "dist" ]; then
    echo 'start tsc process and then start the server'
    npm run tsc; node dist/index.js;
  fi

elif ! [ "$NODE_ENV" = "$PROD" ]; then
  # we are doing dev on the server; start in dev mode
  echo 'starting in development mode!!!'
  npm run dev;
fi