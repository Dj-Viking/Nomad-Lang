import fs from "fs";
import { ANSI_ESCAPES } from "../types";
import { ColorLog } from "../../../server/src/__tests__/utils/helpers";
import { SCREENSHOTS_BASE_PATH, SCREENSHOTS_ACTUALS_PATH } from "../constants";
const testName = process.env.SPECNAME;

(function () {
  console.log("ENV var passed in", process.env.SPECNAME);
  if (!process.env.SPECNAME) {
    console.log(`\x1b[31m 
      [ERROR]: no SPECNAME env variable defined when executing the accept changes script.
      \x1b[33m example: SPECNAME="HomeRegression.spec.ts" npm run acceptChanges
      \x1b[00m
    `);
    process.exit(1);
  }

  try {
    //find all files in the directory that do not pattern match with the word screenshot
    const actualFiles: Array<string> = fs.readdirSync(
      `${SCREENSHOTS_ACTUALS_PATH}/${testName}`
    );
    console.log(
      ANSI_ESCAPES.danger,
      "found actuals files, deleting the ones that dont have screenshot in the name",
      actualFiles,
      "\x1b[00m"
    );
    const notScreenshots: Array<string> = actualFiles.filter(
      (file: string) => !/screenshot/g.test(file)
    );
    console.log(
      ANSI_ESCAPES.warning,
      "found non screenshots to delete",
      notScreenshots,
      ANSI_ESCAPES.reset
    );
    for (let i = 0; i < notScreenshots.length; i++) {
      fs.unlink(
        `${SCREENSHOTS_ACTUALS_PATH}/${testName}/${notScreenshots[i]}`,
        (err) => {
          if (err)
            throw new Error(
              `There was an error trying to delete the non screenshots ${err.message}`
            );
        }
      );
    }
    console.log(
      ANSI_ESCAPES.info,
      "deleted the non screenshots!",
      ANSI_ESCAPES.reset
    );

    const baseFiles = fs.readdirSync(`${SCREENSHOTS_BASE_PATH}/${testName}`);

    console.log("files found for test base screenshots", baseFiles);
    //delete the file we just found in the base folder
    for (let i = 0; i < baseFiles.length; i++) {
      fs.unlink(
        `${SCREENSHOTS_BASE_PATH}/${testName}/${baseFiles[i]}`,
        (err) => {
          if (err)
            throw new Error(
              `there was an error when trying to delete the file ${err.message}`
            );
        }
      );
    }
    new ColorLog("green", "deleted the base file!").genLog();
  } catch (error) {
    console.error(error);
  }
})();
