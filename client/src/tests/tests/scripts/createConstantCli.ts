import { ConstantCliArgs } from "../types";
import { ANSI_ESCAPES } from "../types";
import { deleteOldFile, writeNewFile } from "../utils/helpers";
import path from "path";
import fs from "fs";

//import an fs module for use here
// read constants.ts file and add new data to the file and then re-write the file
// so anytime i need a new constant variable i just run this script
// to concatenate to the end of the constants.ts file with a new constant variable

//args must be typed in this order of declaration
// varName, type, value, description

const varName: string | undefined = process.argv[2];
const type: string | undefined = process.argv[3];
const value: string | undefined = process.argv[4];
const description: string | undefined = process.argv[5];
const args: ConstantCliArgs = { varName, type, value, description } as const;
const currentfilePath = path.resolve(__dirname, "../constants.ts");

//read the constants.ts file from the cypress/integration/tests folder
//readFileSync returns a string value of the document with utf-8 encoding because
// we have to encode the buffer from binary to a string to dynamically change the file later
const currentConstantsFile: string | undefined =
  fs && typeof fs.readFileSync === "function"
    ? fs.readFileSync(currentfilePath, { encoding: "utf-8" })
    : undefined;

(function (): void {
  try {
    //handle if the script didn't have any arguments to throw a console log message
    const missingArgs: Array<string> = [];
    Object.keys(args).forEach((key: string) => {
      if (!args[key as keyof ConstantCliArgs]) {
        missingArgs.push(key);
      }
    });

    if (missingArgs.length > 0) {
      return console.log(
        `${ANSI_ESCAPES.danger}`,
        `Missing arguments. This script requires arguments in this order: 
          ${missingArgs} 
          separated by spaces
  the description argument shall be written as "here is a description" within the quotes to 
  indicate a single string value`,
        `${ANSI_ESCAPES.reset}`
      );
    }
    //generate and write new file
    if (!currentfilePath)
      return console.log(
        ANSI_ESCAPES.danger,
        "WARNING file path invalid or not found for current constants.ts file",
        ANSI_ESCAPES.reset
      );
    //delete old file
    const delRes = deleteOldFile(
      currentfilePath,
      currentConstantsFile as string
    );
    if (!delRes)
      console.log(
        ANSI_ESCAPES.danger,
        `delete returned a falsey value ${delRes}`,
        ANSI_ESCAPES.reset
      );

    const writeRes = writeNewFile(
      currentfilePath,
      currentConstantsFile as string,
      args
    );
    console.log("what is write Res", writeRes);
    if (!writeRes) {
      console.log(
        ANSI_ESCAPES.danger,
        `write res returned falsey value ${writeRes}`,
        ANSI_ESCAPES.reset
      );
    }
    console.log(
      `${ANSI_ESCAPES.success}`, //yellow text ansi escape start
      `
              Created a new constant with these parameters!
              constant: (${varName}) 
              was created with description: (${description})
              of type: (${type})
              with value: (${value})
            `,
      `${ANSI_ESCAPES.reset}` //default color text
    );
  } catch (error) {
    console.log(
      `${ANSI_ESCAPES.danger}`,
      "there was a problem with this script" + error,
      `${ANSI_ESCAPES.reset}`
    );
  }
})();
