#! /bin/bash

# accept the changes of an actual screenshot and copy it from the actuals folder
# into the base folder of the given test name


# make sure the directory we are moving the file from only has one file in it
# make use of SPECNAME="something"
echo 'spec we are accepting changes for: '
echo $SPECNAME
echo '------------------'

# probably unreachable if js script runs before this bash script
if [ "$SPECNAME" = "" ]; then
  echo "[ERROR]: Please define the SPECNAME environment variable before executing this shell script"
  echo "example: SPECNAME='HomeRegression.spec.ts' npm run acceptChanges"
  exit 1
fi

PWD=$(pwd)
SRC="$(ls $PWD/tests/e2e/fixtures/screenshots/actuals/$SPECNAME/*)"
DST=$PWD/tests/e2e/fixtures/screenshots/base/$SPECNAME
echo 'script working directory'
echo '-----------------'
echo $PWD
echo '------------------'
echo 'file we are trying to move'
echo '-----------------'
echo $SRC
echo '-----------------'
echo 'destination'
echo '----------------'
echo $DST
echo '----------------'
echo 'moving file'
echo '----------------'
mv "$SRC" $DST
echo 'complete'


