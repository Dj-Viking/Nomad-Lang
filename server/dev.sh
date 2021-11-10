if [ -d "dist" ]; then
  echo "found dist directory, starting server..."
  nodemon dist/index.js
elif ! [ -d "dist" ]; then
  echo "no dist folder detected, compiling typescript, and then starting server"
  npm run tsc;
  echo $SVDIR
  nodemon dist/index.js
fi