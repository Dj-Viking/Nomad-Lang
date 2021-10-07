import fs from "fs";

interface IDeleteDiffResult {
  complete: boolean;
  error: null | Error;
}

export async function deleteDiff(testName: string): Promise<IDeleteDiffResult> {
  try {
    const dir: Array<string> = fs.readdirSync(
      `./tests/e2e/fixtures/screenshots/diff/${testName}`
    );
    console.log("\x1b[32m", "diff directory", dir, "\x1b[00m");

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
    return {
      complete: true,
      error: err,
    };
  }
}
