#! /bin/bash

PROD="production"

if [ "$NODE_ENV" = "$PROD" ]; then
  #check if theres a build folder and if not build the project
  cd client;
  if ! [ -d "dist" ]; then
    echo "no client dist folder yet so building production version of app..."
    npm run build;
  fi

  #back to root start server in production mode
  cd ..;

  echo "==============================="
  echo "🔮✨ starting app in production mode 🚀"
  echo "==============================="
  npm run start:prod;
  
elif ! [ "$NODE_ENV" = "$PROD" ]; then
  
  # TODO: delete build folder during dev script
  
  # if first arg after npm start was 'test' then let istanbul 
  # instrument the app in dev mode to 
  # set up for the cypress e2e tests
  if [ "$1" = "test" ]; then 
    echo "==============================="
    echo "🛠 starting app in test mode 🔍"
    echo "==============================="
    npm run test:concurrently;
  else
    echo "==============================="
    echo "🔮✨ starting app in dev mode 🛠"
    echo "==============================="
    npm run concurrently;
  fi

fi
