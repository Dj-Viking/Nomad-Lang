import fs from "fs";
import { ColorLog } from "../../../server/src/__tests__/utils/helpers";

const logger = ColorLog;

interface IDeleteDiffResult {
  complete: boolean;
  error: null | Error;
}

(async function testDeleteDiff(testName: string): Promise<IDeleteDiffResult> {
  try {
    // const something = true;
    // if (something) {
    //   _resolve((() => console.log(something))());
    // } else {
    //   _reject();
    // }
    const dir: Array<string> = fs.readdirSync(
      `./tests/e2e/fixtures/screenshots/diff/${testName}`
    );
    console.log("\x1b[33m", "diff directory", dir, "\x1b[00m");

    if (dir.length) {
      console.log("diff directory has something", dir);

      fs.unlink(
        `./tests/e2e/fixtures/screenshots/diff/${testName}/diff.png`,
        (err) => {
          if (err) {
            throw new Error(
              `There was an error trying to delete the diff png: ${err.message}`
            );
          }
        }
      );
      return {
        complete: true,
        error: null,
      };
    } else {
      throw new Error("nothing in diff directory to delete");
    }
  } catch (error) {
    const err = error as Error;
    new logger("red", err.message as Error["message"]).genLog();
    return {
      complete: true,
      error: err,
    };
  }
})("LoadHome.spec.ts").then(console.log);
