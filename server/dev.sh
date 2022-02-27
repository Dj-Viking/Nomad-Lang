#! /bin/bash
if [ -d "dist" ]; then
  echo "✨🛠 found dist directory, starting server in dev mode... 🛠✨"
  npm run concurrently
elif ! [ -d "dist" ]; then
  echo "✨🛠 no dist folder detected, compiling typescript, and then starting server in dev mode 🛠✨"
  npm run concurrently
fi