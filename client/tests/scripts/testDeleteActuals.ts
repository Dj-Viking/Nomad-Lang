import fs from "fs";
import { ColorLog } from "../../../server/src/__tests__/utils/helpers";
import { ACTUALS_LOADHOMESPEC_PATH } from "../constants";

const logger = ColorLog;

(function (): void {
  try {
    const files = fs.readdirSync(ACTUALS_LOADHOMESPEC_PATH);
    if (!files.length) {
      console.log(
        "\x1b[33m",
        "No files were found in this directory",
        "\x1b[00m"
      );
    }

    if (files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        fs.unlink(`${ACTUALS_LOADHOMESPEC_PATH}/${files[i]}`, (err) => {
          if (err) throw new Error(err.message);
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
