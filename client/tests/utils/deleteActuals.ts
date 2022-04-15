import fs from "fs";
import { ColorLog } from "../../../server/src/__tests__/utils/helpers";

const logger = ColorLog;

export function deleteActuals(path: string): void {
  console.log("\x1b[32m", "debugging headless path", path, "\x1b[00m");
  try {
    const files = fs.readdirSync(path);
    if (!files.length) {
      new logger("yellow", "No files were found in this directory").genLog();
    }

    if (files.length > 0) {
      console.log(
        "\x1b[33m",
        "files found to delete BE CAREFUL MAKE SURE YOU KNOW EXACTLY WHAT PATH YOU ARE USING!! COMMENT OUT THE UNLINK IF YOU DONT KNOW YET",
        files,
        "\x1b[00m"
      );
      for (let i = 0; i < files.length; i++) {
        fs.unlink(`${path}/${files[i]}`, (err) => {
          if (err) console.error(err);
        });
      }
    }
    //wait for the first read dir to finish
    setTimeout(() => {
      const shouldBeEmpty = fs.readdirSync(path);
      console.log("\x1b[33m", "should be empty", shouldBeEmpty, "\x1b[00m");

      if (!shouldBeEmpty.length) {
        new logger("green", "successfully deleted the files!").genLog();
      }
    }, 300);
  } catch (error) {
    new ColorLog("red", `error while readding dir ${error}`).genLog();
  }
}
