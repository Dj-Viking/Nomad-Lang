import fs from "fs";
import Pixelmatch from "pixelmatch";
import { PNGWithMetadata, PNG } from "pngjs";

interface IWriteDiffResult {
  complete: boolean;
  matchNum: number | null;
  error: string | Error | null;
}

//create the diff in here since i can't pass a circular object into the task argument list

// eslint-disable-next-line
export async function writeDiff(args: {
  testName: string;
  writePath: string;
  fileName: string;
}): Promise<IWriteDiffResult> {
  const { fileName, writePath, testName } = args;
  try {
    // eslint-disable-next-line
    return new Promise((resolve, _reject) => {
      const dir: Array<string> = fs.readdirSync(
        `./tests/e2e/fixtures/screenshots/diff/${testName}`
      );
      console.log("diff directory", dir);
      const baseDir: Array<string> = fs.readdirSync(
        `./tests/e2e/fixtures/screenshots/base/${testName}`
      );
      console.log("base dir", baseDir);
      const actualsDir: Array<string> = fs.readdirSync(
        `./tests/e2e/fixtures/screenshots/base/${testName}`
      );
      console.log("actuals dir", actualsDir);

      //do the pixelmatch here to create the diff image i guess thats how it works?
      // to modify the diff data after the pixelmatch function?? not sure yet

      //get the base and actual based on
      const basePng = fs.readFileSync(
        `./tests/e2e/fixtures/screenshots/base/${testName}/${fileName}`
      );
      if (basePng) {
        console.log("found base png", basePng);
      }
      const actualPng = fs.readFileSync(
        `./tests/e2e/fixtures/screenshots/actuals/${testName}/${fileName}`
      );
      if (actualPng) {
        console.log("found actual png", actualPng);
      }

      const base: PNGWithMetadata = PNG.sync.read(basePng);
      console.log("base img", base);

      let actual: PNGWithMetadata;

      //WAITING FOR READS TO FINISH??? NOT SURE WHY IM GETTING THIS ERROR FROM pngjs package IN THIS TEST: There are some read requests waitng on finished stream
      // OKAY THIS WORKED YAY
      setTimeout(() => {
        actual = PNG.sync.read(actualPng);
        console.log("actual img", actual);
        //pixel match and then write the diff to disk
        const { width, height } = base;
        const diff = new PNG({ width, height });
        const threshold = 0.1;
        const matchNum: number = Pixelmatch(
          base.data,
          actual.data,
          diff.data,
          width,
          height,
          { threshold }
        );

        fs.writeFileSync(
          `${writePath}/${testName}/diff.png`,
          PNG.sync.write(diff)
        );
        resolve({
          complete: true,
          matchNum,
          error: null,
        } as IWriteDiffResult);
        // return dir;
      }, 200);
    });
  } catch (error) {
    const err = error as Error;
    return {
      complete: true,
      matchNum: null,
      error: err,
    };
  }
}
