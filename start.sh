#! /bin/bash
echo 'checking javascript'
cd server;
PWD=$(pwd)
SVDIR="$(ls $PWD)"
echo $SVDIR
echo '----------------------------'
echo '----------------------------'


# if [ -d "$DIST" ]; then
#   echo "found server directory"
# fi
if [ -d "dist" ]; then
  echo "found dist directory, starting server..."
  node dist/index.js
elif ! [ -d "dist" ]; then
  echo "no dist folder detected, compiling typescript, and then starting server"
  npm run tsc;
  echo $SVDIR
  node dist/index.js
fi

# echo '----------------------------'
# echo '----------------------------'
# echo '----------------------------'
# echo '----------------------------'
# string="checking this loop"

# IFS=', ' read -r -a array <<< "$string"

# echo 'printing elements'

# for element in "${array[@]}"
# do
#     echo "$element"
# done

# if-env NODE_ENV=production && npm run server:prod || npm run server:dev

