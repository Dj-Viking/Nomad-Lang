SPECNAME="$1"

CY_SPEC_PATH=""

if [ "$1" = "" ]; then
  echo "[INFO]: spec file name not provided, setting path to run all specs"
  echo "[INFO]: If desired to run a specific spec file just provide the name without the file extensions"
  echo "[INFO]: example: CardUnit"
  SPECNAME="*"
fi

echo '[INFO]: starting headless cypress...'
echo ' if SPECNAME was not provided will run all specs as "*": ' 
echo "$SPECNAME"

if [ "$SPECNAME" = "*" ]; then
  CY_SPEC_PATH="./tests/e2e/specs/$SPECNAME.spec.ts"
  $(npm bin)/cypress run --headless --spec "$CY_SPEC_PATH"
else
  CY_SPEC_PATH="./tests/e2e/specs/$SPECNAME.spec.ts"
  $(npm bin)/cypress run --headless --spec "$CY_SPEC_PATH"
fi