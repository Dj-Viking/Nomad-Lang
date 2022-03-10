import fs from "fs";
import { ColorLog } from "../../../server/src/__tests__/utils/helpers";
import { ACTUALS_LOADHOMESPEC_PATH } from "../constants";

const logger = ColorLog;

(function (): void {
  try {
    const files = fs.readdirSync(ACTUALS_LOADHOMESPEC_PATH);
    if (!files.length) {
      new logger("yellow", "No files were found in this directory").genLog();
    }

    if (files.length > 0) {
      console.log("files found to delete", files);
      for (let i = 0; i < files.length; i++) {
        fs.unlink(`${ACTUALS_LOADHOMESPEC_PATH}/${files[i]}`, (err) => {
          if (err) console.error(err);
        });
      }
    }
    //wait for the first read dir to finish
    setTimeout(() => {
      const shouldBeEmpty = fs.readdirSync(ACTUALS_LOADHOMESPEC_PATH);
      console.log("should be empty", shouldBeEmpty);

      if (!shouldBeEmpty.length) {
        new logger("green", "successfully deleted the files!").genLog();
      }
    }, 300);
  } catch (error) {
    new ColorLog("red", `error while readding dir ${error}`).genLog();
  }
})();
