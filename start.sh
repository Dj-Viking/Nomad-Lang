#! /bin/bash

PROD="production"

NODE_ENV="production"


if [ "$NODE_ENV" = "$PROD" ]; then
  #check if theres a build folder and if not build the project
  cd client;
  if ! [ -d "dist" ]; then
    echo "no client dist folder yet yet so building"
    npm run build;
  fi

  #back to root start server in production mode
  cd ..;

  echo "==============================="
  echo "🔮✨ starting app in production mode 🚀"
  echo "==============================="

  npm run start:prod;
elif ! [ "$NODE_ENV" = "$PROD" ]; then

  echo "==============================="
  echo "🔮✨ starting app in dev mode 🛠"
  echo "==============================="
  
  # TODO: delete build folder during dev script
  npm run concurrently;
fi
