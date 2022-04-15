import fs from "fs";
import { SCREENSHOTS_ACTUALS_PATH } from "../constants";

(function () {
  const files = fs.readdirSync(SCREENSHOTS_ACTUALS_PATH);
  console.log("\x1b[32m", "found actuals directory", files, "\x1b[00m");
})();
