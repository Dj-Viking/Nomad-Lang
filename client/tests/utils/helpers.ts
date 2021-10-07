import moment from "moment";
import fs from "fs";
import path from "path";

import { ANSI_ESCAPES } from "../types";
import {
  ConstantCliArgs,
  /*FixtureCliArgs,*/ IkeyValueMappedObj,
  IMissingArgs,
  KeyValueMappedObj,
} from "../types";
/**
 * the date passed in is the generated object from the 3 string input select fields
 * @param date moment object passed in from the form inputs
 * @returns number return the number as a unix timestamp converted from the value of milliseconds of the date object
 */
export const calculateUnixSecondsTimeStamp = (date: moment.Moment): number => {
  return date.valueOf() / 1000;
};

/**
 * helper function used to stringify the imported json object from a cypress fixture path constant
 * @param json JSON object imported from a fixture
 * @returns a formatted text of the json object to match against an html modal <pre> element for testing
 */
export function stringifyJson(obj: Record<string, unknown>): string {
  return JSON.stringify(obj, null, 2);
}

/**
 * Helps to format the text that will be written to the new file according to the type arg
 * @param typeArg string value entered as the type argument to the script
 * @param valueArg string value entered as the value argument to the script
 * @returns formatted string depending if the value was a certain type
 */
export function formatTypeValue(typeArg: string, valueArg: string): string {
  //if it is a number return the value as the number
  if (!isNaN(Number(valueArg))) return `${valueArg}`;
  if (typeArg === "string") return `"${valueArg}"`;
  else return `${valueArg}`;
}

const constantsFilePath = path.resolve(__dirname, "../constants.ts");

//delete the old file
export function deleteOldFile(
  path: string,
  constantsFile: string
): boolean | void {
  console.log(
    "current constants file reading in delete old file",
    constantsFile
  );
  let error: Error | null;
  fs.unlink(path, (err) => {
    error = err;
    console.log("unlink error value", error);
    if (err) {
      console.log(
        `${ANSI_ESCAPES.danger}`,
        "there was a problem deleting the file" + err,
        `${ANSI_ESCAPES.reset}`
      );
      return false;
    } else {
      console.log(
        `${ANSI_ESCAPES.info}`,
        "deleted the old file",
        `${ANSI_ESCAPES.reset}`
      );
      return true;
    }
  });
}

export function writeNewFile(
  path: string,
  currentConstantsFile: string,
  args: ConstantCliArgs
): boolean | void {
  let error: Error | null;
  console.log(
    "current constants file reading from write new file",
    currentConstantsFile
  );

  if (!currentConstantsFile)
    return console.log(
      `${ANSI_ESCAPES.danger}`,
      "WARNING: the current constants file was not found with fs module or was empty",
      `${ANSI_ESCAPES.reset}`
    );
  fs.writeFile(
    path,
    generateNewConstantsFile(currentConstantsFile, args),
    (err) => {
      error = err;
      console.log("logging error in write file", error);

      if (err) {
        console.log(
          `${ANSI_ESCAPES.danger}`,
          "there was a problem writing the file" + err,
          `${ANSI_ESCAPES.reset}`
        );
        return false;
      } else {
        console.log(
          `${ANSI_ESCAPES.warning}`,
          `file written successfully to the path ${constantsFilePath}`,
          `${ANSI_ESCAPES.reset}`
        );
        return true;
      }
    }
  );
}

export function generateNewConstantsFile(
  currentFile: string,
  args: ConstantCliArgs
): string {
  const { varName, description, type, value } = args;
  return `${currentFile}
/**
 * ${description} 
 */
export const ${varName}: ${type} = ${formatTypeValue(
    <string>type,
    <string>value
  )};
`;
}

/**
 * helper function to generate the key value rows of the json string before the final {} wrapper right before the file gets written
 * @param rows number of rows the json object has
 * @param obj key value store of the processsed input argvs
 * @returns dynamically generated template string meant for writing a .json file for a cypress fixture
 */
export function generateFixtureRows(
  obj: IkeyValueMappedObj["obj"]
): string | undefined {
  let rows = ""; //concatenate whatever text you want based on cli args
  Object.keys(obj).forEach(
    (key: string, _index: number, _array: Array<string>) => {
      if (obj[key as keyof IkeyValueMappedObj["obj"]]) {
        rows += `
          ${
            _index < _array.length - 1
              ? //add comma if it is not the last row in the json
                `   "${key}": "${obj[key as keyof IkeyValueMappedObj["obj"]]}",`
              : `   "${key}": "${obj[key as keyof IkeyValueMappedObj["obj"]]}"`
          }
        `;
      }
    }
  );

  console.log("output json before final wrapping stage", rows);

  return rows;
}

export function createMissingArgsMessage(
  args: IMissingArgs,
  keyValObj: KeyValueMappedObj
): void {
  if (args.fileName) {
    console.log(
      `${ANSI_ESCAPES.danger}`,
      `
      Missing arguments. 
      This script requires a file name input as the first argument ${args.fileName},
      `,
      `${ANSI_ESCAPES.reset}`
    );
  }
  if (args.jsonMainProp) {
    console.log(
      `${ANSI_ESCAPES.danger}`,
      `
      Missing arguments. 
      This script requires a json main property input to name the property 
      of the submitted form value to assert as the first argument ${args.jsonMainProp},
      `,
      `${ANSI_ESCAPES.reset}`
    );
  }
  if (args.restOfArgs) {
    console.log(
      `${ANSI_ESCAPES.danger}`,
      `
      Missing arguments for either keys or values. ${
        keyValObj.obj === {} ? "key value store was empty {}" : ""
      }
      Missing Space delimited key value pairs in the script:
      "npm run create:fixture" 
      filename jsonMainProp "key" "value" "key" "value"
      don't omit any values for each key input
      `,
      `${ANSI_ESCAPES.reset}`
    );
  }
}

/**
 *
 * @param path path to save the json file
 * @param jsonRows jsonRows string[] that is generated by the obj instance created from input args
 * @returns
 */
export function writeFixtureJson(
  path: string,
  // fileName: string,
  data: string,
  jsonRows: string | undefined
): Promise<void | boolean | Error> {
  return new Promise((resolve, reject) => {
    if (!jsonRows)
      (() => {
        console.log(
          `${ANSI_ESCAPES.danger}`,
          `missing json rows!`,
          `${ANSI_ESCAPES.reset}`
        );
        // return false;
      })();

    fs.writeFile(`${path}`, data, (err) => {
      if (err) reject("error when writing the file" + err);
    });

    resolve(true);
  });
}
