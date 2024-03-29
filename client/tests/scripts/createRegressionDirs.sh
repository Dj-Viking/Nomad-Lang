#! /bin/bash
# npm run regressionDirs:create <your new spec file name> 

#if something errors stop execution of the shell script
set -e;

DIR=$1;

echo 'creating new directories for the test' $DIR
echo 'nested inside the base, actual, and diff fixture directories'

cd tests; 
cd e2e;
cd fixtures;
cd screenshots;
cd actuals; mkdir $DIR;
cd ..;
cd base; mkdir $DIR;
cd ..;
cd diff; mkdir $DIR;
echo 'complete';
echo 'printing new directories'
cd ..;
echo 'actuals'
echo '--------------------'
cd actuals; ls; cd ..;
echo '--------------------'
echo 'base'
echo '--------------------'
cd base; ls; cd ..;
echo '--------------------'
echo 'diff'
echo '--------------------'
cd diff; ls; 
echo '--------------------'