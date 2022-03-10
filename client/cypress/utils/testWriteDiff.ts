// import { PNG, PNGWithMetadata } from "pngjs";
import fs from "fs";
import Pixelmatch from "pixelmatch";
import { PNG, PNGWithMetadata } from "pngjs";
import {
  PATH_TO_ACTUAL_FROM_TASK_FUNCTION,
  PATH_TO_BASE_FROM_TASK_FUNCTION,
} from "../constants";

(async function () {
  // eslint-disable-next-line
  return new Promise((resolve, _reject) => {
    const dir: Array<string> = fs.readdirSync(
      "./tests/e2e/fixtures/screenshots/base/LoadHome.spec.ts"
    );
    console.log("directory", dir);

    const baseFile = fs.readFileSync(PATH_TO_BASE_FROM_TASK_FUNCTION);
    const basePng: PNGWithMetadata = PNG.sync.read(baseFile);
    console.log("basepng", basePng);
    const actualFile = fs.readFileSync(PATH_TO_ACTUAL_FROM_TASK_FUNCTION);
    const actualPng: PNGWithMetadata = PNG.sync.read(actualFile);
    console.log("actual png", actualPng);

    const { width, height } = basePng;
    const diff = new PNG({ width, height });
    console.log("diff image", diff);
    const threshold = 0.1;

    const matchNum: number = Pixelmatch(
      basePng.data,
      actualPng.data,
      diff.data,
      width,
      height,
      { threshold }
    );
    console.log("match num", matchNum);

    fs.writeFileSync(
      "./tests/e2e/fixtures/screenshots/diff/LoadHome.spec.ts/diff.png",
      PNG.sync.write(diff)
    );

    const writtenDiff = fs.readFileSync(
      "./tests/e2e/fixtures/screenshots/diff/LoadHome.spec.ts/diff.png"
    );
    console.log("written diff", writtenDiff);

    resolve(true);
  });
})();
