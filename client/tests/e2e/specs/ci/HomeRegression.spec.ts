import {
  ACTUAL_HOME_FULL_PAGE_FIXTURE,
  BASE_HOME_FULL_PAGE_FIXTURE,
  DIFF_FIXTURE_FOLDER_PATH,
  ACTUALS_HOMEREGRESSIONSPEC_PATH,
  HOME_SCREENSHOT_FILE_NAME,
  ACTUALS_HOMEREGRESSIONSPEC_PATH_HEADLESS,
} from "../../../constants";
import { PNG, PNGWithMetadata } from "pngjs";
import Pixelmatch from "pixelmatch";

let baselinePng: PNGWithMetadata;
const baseDimensions = {
  width: 0,
  height: 0,
};
let actualPng: PNGWithMetadata;
const actualDimensions = {
  width: 0,
  height: 0,
};
let diff: PNG;
let matchNum = 123;

if (Cypress.env("TAKE_SCREENSHOTS") === "yes") {

  describe("home-page-regression", () => {
    it("deletes any actuals for this test before we enter the page", () => {
      cy.deleteActuals({
        headlessPath: ACTUALS_HOMEREGRESSIONSPEC_PATH_HEADLESS,
        headedPath: ACTUALS_HOMEREGRESSIONSPEC_PATH
      });
    });
    it("visits the home page", () => {
      cy.goToHomePage();
    });
    it("screenshots-the-entire-page", () => {
      cy.get("html").screenshot({ capture: "runner" });
    });
  });
  
  describe("compares base with actual", () => {
    it("get the baseline png of the home page", () => {
      cy.fixture(
        /home-page-regression/g.test(BASE_HOME_FULL_PAGE_FIXTURE)
          ? BASE_HOME_FULL_PAGE_FIXTURE
          : "home page base png found"
      )
        .then(Cypress.Blob.base64StringToBlob)
        .then(async (fileBlob: Blob) => {
          const fileArrayBuffer = await fileBlob.arrayBuffer();
          baselinePng = PNG.sync.read(
            Buffer.from(new Uint8Array(fileArrayBuffer))
          );
          baseDimensions.height = baselinePng.height;
          baseDimensions.width = baselinePng.width;
          console.log("baseline home page png", baselinePng);
        });
    });
  
    it("get the actual screenshotted png of the home page", () => {
      cy.fixture(
        /home-page-regression/g.test(ACTUAL_HOME_FULL_PAGE_FIXTURE)
          ? ACTUAL_HOME_FULL_PAGE_FIXTURE
          : "actual png not found"
      )
        .then(Cypress.Blob.base64StringToBlob)
        .then(async (fileBlob: Blob) => {
          const fileArrayBuffer = await fileBlob.arrayBuffer();
          actualPng = PNG.sync.read(Buffer.from(new Uint8Array(fileArrayBuffer)));
          actualDimensions.height = actualPng.height;
          actualDimensions.width = actualPng.width;
          console.log("home page actual png", actualPng);
        });
    });
  
    it("write the diff to disk only if the dimensions are the same", () => {
      expect(baseDimensions.height).to.equal(actualDimensions.height);
      expect(baseDimensions.width).to.equal(actualDimensions.width);
      console.log("write diff task args", {
        testName: "HomeRegression.spec.ts",
        writePath: DIFF_FIXTURE_FOLDER_PATH,
        fileName: HOME_SCREENSHOT_FILE_NAME,
      });
  
      cy.task("writeDiff", {
        testName: "HomeRegression.spec.ts",
        writePath: DIFF_FIXTURE_FOLDER_PATH,
        fileName: "home-page-regression -- screenshots-the-entire-page.png",
      }).then((resultOrNull) => {
        console.log("write home page diff result", resultOrNull);
      });
    });
  
    it("calculate the diff between base and actual", () => {
      const { width, height } = baselinePng;
      diff = new PNG({ width, height });
      console.log("home page initial diff png", diff);
      const threshold = 0.1;
  
      matchNum = Pixelmatch(
        baselinePng.data,
        actualPng.data,
        diff.data,
        width,
        height,
        { threshold }
      );
      console.log("\x1b[32m", "match num value", matchNum, "\x1b[00m");
      if (matchNum === 0) {
        cy.task("deleteDiff", "HomeRegression.spec.ts");
      }
      expect(matchNum).to.equal(0);
    });
  });
} else {
  describe("skips screenshots in ci", () => {
    it("skips", () => {
      expect(true).to.eq(true);
    });
  });
}
