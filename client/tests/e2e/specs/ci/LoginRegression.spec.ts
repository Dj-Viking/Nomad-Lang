import {
  BASE_LOGIN_FULL_PAGE_FIXTURE,
  ACTUAL_LOGIN_FULL_PAGE_FIXTURE,
  DIFF_FIXTURE_FOLDER_PATH,
  ACTUALS_LOGINREGRESSIONSPEC_PATH,
  LOGIN_SCREENSHOT_FILE_NAME,
  ACTUALS_LOGINREGRESSIONSPEC_PATH_HEADLESS,
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
let matchNum;

if (Cypress.env("TAKE_SCREENSHOTS") === "yes") {

  describe("login-page-regression", () => {
    it("deletes any actuals for this test before we enter the page", () => {
      cy.deleteActuals({
        headedPath: ACTUALS_LOGINREGRESSIONSPEC_PATH,
        headlessPath: ACTUALS_LOGINREGRESSIONSPEC_PATH_HEADLESS
      });
    });
    it("visits the site home page", () => {
      cy.goToHomePage()
        .clickLoginButton();
    });
    it("screenshots-the-login-page", () => {
      cy.get("html").screenshot({ capture: "viewport" });
    });
  });
  
  describe("compares base with actual", () => {
    it("get the baseline png of the login page", () => {
      cy.fixture(
        /login-page-regression/g.test(BASE_LOGIN_FULL_PAGE_FIXTURE)
          ? BASE_LOGIN_FULL_PAGE_FIXTURE
          : "login page fixture not found"
      )
        .then(Cypress.Blob.base64StringToBlob)
        .then(async (fileBlob: Blob) => {
          const fileArrayBuffer = await fileBlob.arrayBuffer();
          baselinePng = PNG.sync.read(
            Buffer.from(new Uint8Array(fileArrayBuffer))
          );
          baseDimensions.height = baselinePng.height;
          baseDimensions.width = baselinePng.width;
          console.log("baseline login page png", baselinePng);
        });
    });
    it("get the actual screenshotted png of the login page", () => {
      cy.fixture(
        /login-page-regression/g.test(ACTUAL_LOGIN_FULL_PAGE_FIXTURE)
          ? ACTUAL_LOGIN_FULL_PAGE_FIXTURE
          : "actual login page fixture not found"
      )
        .then(Cypress.Blob.base64StringToBlob)
        .then(async (fileBlob: Blob) => {
          const fileArrayBuffer = await fileBlob.arrayBuffer();
          actualPng = PNG.sync.read(Buffer.from(new Uint8Array(fileArrayBuffer)));
          actualDimensions.height = actualPng.height;
          actualDimensions.width = actualPng.width;
          console.log("login page actual png", actualPng);
        });
    });
    it("write the diff to disk only if the dimensions are the same", () => {
      expect(baseDimensions.height).to.equal(actualDimensions.height);
      expect(baseDimensions.width).to.equal(actualDimensions.width);
      console.log("write diff task args", {
        testName: "LoginRegression.spec.ts",
        writePath: DIFF_FIXTURE_FOLDER_PATH,
        fileName: LOGIN_SCREENSHOT_FILE_NAME,
      });
  
      cy.task("writeDiff", {
        testName: "LoginRegression.spec.ts",
        writePath: DIFF_FIXTURE_FOLDER_PATH,
        fileName: LOGIN_SCREENSHOT_FILE_NAME,
      }).then((resultOrNull) => {
        console.log("write login page diff result", resultOrNull);
      });
    });
  
    it("calculate the diff between base and actual", () => {
      const { width, height } = baselinePng;
      diff = new PNG({ width, height });
      console.log("login page initial diff png");
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
        cy.task("deleteDiff", "LoginRegression.spec.ts");
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
