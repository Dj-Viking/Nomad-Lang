#!/usr/bin/env bash

# accept the changes of an actual screenshot and copy it from the actuals folder
# into the base folder of the given test name

# make sure the directory we are moving the file from only has one file in it

# TESTNAME=$1
echo 'spec we are accepting changes for: '
echo $SPECNAME
echo '------------------'

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


