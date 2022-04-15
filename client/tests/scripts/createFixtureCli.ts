import fs from "fs";
import path from "path";
import { ANSI_ESCAPES } from "../types";
import {
  // FixtureCliArgs,
  IMissingArgs,
  KeyValueMappedObjClass,
  KeyValueMappedObj,
  IkeyValueMappedObj,
  IPreJsonObj,
  PreJsonObjClass,
} from "../types";

import {
  createMissingArgsMessage,
  // generateNewFixtureJson,
  // writeFile,
  // writeFixtureJson,
  generateFixtureRows,
  stringifyJson,
} from "../utils/helpers";

console.log(
  `${ANSI_ESCAPES.link}`,
  `
  Starting create cypress fixture script! 🔮 ✨ 🌙
  `,
  `${ANSI_ESCAPES.reset}`
);

const fixtureFolderPathPrefix: string = path.resolve(
  "cypress/fixtures/submittedFormJson"
);

// console.log('checking raw argv', process.argv);

//GET ARGV INPUT AND ARRANGE IT TO USE LATER
//GET FILE NAME INPUT
const fileName: string | undefined = process.argv[2];
//GET JSON OBJECT MAIN PROP
const JSONmainProp: string | undefined = process.argv[3];
//SLICE THE REST OF THE ARGS OFF THE ORIGINAL INPUT PROCESS ARGS ARRAY TO CREATE AN ARRAY TO ITERATE OVER TO ASSIGN A STRING
// TO CONTAIN THE ROW OF JSON OF THE KEY VALUE PAIR
const slicedArgs: Array<string> | [] = process.argv.slice(4);
// console.log('checking sliced args', slicedArgs);

const restOfArgs: Array<string> | [] = new Array(...slicedArgs);
console.log("checking rest of args", restOfArgs);

const keyValueMappedObj: KeyValueMappedObj = new KeyValueMappedObjClass(
  fileName as string | undefined,
  JSONmainProp as string | undefined,
  restOfArgs as Array<string> | []
);
console.log(
  `${ANSI_ESCAPES.warning}`,
  "key value mapped thing with rest of args after field name",
  `${ANSI_ESCAPES.reset}`
);
console.log(keyValueMappedObj);

(async function () {
  return new Promise((resolve, reject) => {
    try {
      fs.readdir(fixtureFolderPathPrefix, (err, files) => {
        if (err)
          return console.log(
            `${ANSI_ESCAPES.danger}`,
            "error when reading files" + err,
            `${ANSI_ESCAPES.reset}`
          );
        if (files.length)
          return console.log("files in the current fixtures directory", files);
      });

      let invalidArgsCount = 0;
      keyValueMappedObj
        .getObjKeys()
        // eslint-disable-next-line
        .forEach((key: string, _index: number, _array: Array<string>) => {
          if (!keyValueMappedObj.obj[key as keyof IkeyValueMappedObj["obj"]]) {
            invalidArgsCount++;
          }
        });
      if (keyValueMappedObj.getObjKeyValues() === undefined) invalidArgsCount++;

      //handle if the script didn't have any arguments to throw a console log message
      const missingArgs: IMissingArgs = {
        fileName: !keyValueMappedObj.fileName ? "missing: filename" : false,
        jsonMainProp: !keyValueMappedObj.jsonMainProp
          ? "missing: jsonMainProp name"
          : false,
        restOfArgs: invalidArgsCount > 0 ? true : false,
      };
      //abstracted the missing args console message
      if (
        process.argv[2] === undefined ||
        process.argv[3] === undefined ||
        slicedArgs.length === 0
      ) {
        return (() =>
          console.log(
            createMissingArgsMessage(missingArgs, keyValueMappedObj)
          ))();
      }

      //get args and create the inside rows of the json object of the fixture
      const jsonRows =
        keyValueMappedObj.obj !== {}
          ? generateFixtureRows(keyValueMappedObj.obj)
          : undefined;
      console.log("checking json rows", jsonRows);

      //wrap the final string with {} and write the file
      const jsonMainPropKeyString = process.argv[3];
      console.log("checking prop string", jsonMainPropKeyString);

      const JsObj: IPreJsonObj = new PreJsonObjClass(
        `${jsonMainPropKeyString}`,
        keyValueMappedObj.obj
      );
      console.log(JsObj);

      // eslint-disable-next-line
      if (!JsObj.hasOwnProperty(`${process.argv[3]}`))
        return (() =>
          console.log(
            `${ANSI_ESCAPES.danger}`,
            `Missing main boba form prop arg input`,
            `${ANSI_ESCAPES.reset}`
          ))();

      fs.writeFile(
        fixtureFolderPathPrefix + `/${keyValueMappedObj.fileName}.json`,
        stringifyJson(JsObj as Record<string, unknown>),
        (err) => {
          if (err)
            reject(
              (() =>
                console.log(
                  `${ANSI_ESCAPES.danger}`,
                  `
            there was a problem writing the file ${err}
            `,
                  `${ANSI_ESCAPES.reset}`
                ))()
            );
          resolve(true);
        }
      );
    } catch (error) {
      console.error(error);
    }
  });
})();
