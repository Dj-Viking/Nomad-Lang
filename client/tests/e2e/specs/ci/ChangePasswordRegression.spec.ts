import {
  ACTUAL_CHANGEPASS_FULL_PAGE_FIXTURE,
  BASE_CHANGEPASS_FULL_PAGE_FIXTURE,
  DIFF_FIXTURE_FOLDER_PATH,
  CHANGE_PASSWORD_SCREENSHOT_FILE_NAME,
  ACTUALS_CHANGE_PASSWORD_REGRESSION_SPEC_PATH,
  ACTUALS_CHANGE_PASSWORD_REGRESSION_SPEC_PATH_HEADLESS
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
let matchNum = 1;

if (Cypress.env("TAKE_SCREENSHOTS") === "yes") {
  describe("changepass-page-regression", () => {
    it("deletes any actuals for this test before we enter the page", () => {
      cy.deleteActuals({
        headedPath: ACTUALS_CHANGE_PASSWORD_REGRESSION_SPEC_PATH, 
        headlessPath: ACTUALS_CHANGE_PASSWORD_REGRESSION_SPEC_PATH_HEADLESS
      });
    });
    it("visits the forgot password page", () => {
      cy.navigatePage("/changepass/kajsdfkajsdf");
    });
    it("screenshots-the-entire-page", () => {
      cy.get("html").screenshot({ capture: "runner" });
    });
  });
  
  describe("compares base with actual", () => {
    it("get the baseline png of the changepass page", () => {
      cy.fixture(
        /changepass-page-regression/g.test(BASE_CHANGEPASS_FULL_PAGE_FIXTURE)
          ? BASE_CHANGEPASS_FULL_PAGE_FIXTURE
          : "changepass page base png found"
      )
        .then(Cypress.Blob.base64StringToBlob)
        .then(async (fileBlob: Blob) => {
          const fileArrayBuffer = await fileBlob.arrayBuffer();
          baselinePng = PNG.sync.read(
            Buffer.from(new Uint8Array(fileArrayBuffer))
          );
          baseDimensions.height = baselinePng.height;
          baseDimensions.width = baselinePng.width;
          console.log("baseline changepass page png", baselinePng);
        });
    });
  
    it("get the actual screenshotted png of the forgotpass page", () => {
      cy.fixture(
        /changepass-page-regression/g.test(ACTUAL_CHANGEPASS_FULL_PAGE_FIXTURE)
          ? ACTUAL_CHANGEPASS_FULL_PAGE_FIXTURE
          : "actual changepass png not found"
      )
        .then(Cypress.Blob.base64StringToBlob)
        .then(async (fileBlob: Blob) => {
          const fileArrayBuffer = await fileBlob.arrayBuffer();
          actualPng = PNG.sync.read(Buffer.from(new Uint8Array(fileArrayBuffer)));
          actualDimensions.height = actualPng.height;
          actualDimensions.width = actualPng.width;
          console.log("changepass page actual png", actualPng);
        });
    });
  
    it("write the diff to disk only if the dimensions are the same", () => {
      expect(baseDimensions.height).to.equal(actualDimensions.height);
      expect(baseDimensions.width).to.equal(actualDimensions.width);
      console.log("write diff task args", {
        testName: "ChangePasswordRegression.spec.ts",
        writePath: DIFF_FIXTURE_FOLDER_PATH,
        fileName: CHANGE_PASSWORD_SCREENSHOT_FILE_NAME,
      });
  
      cy.task("writeDiff", {
        testName: "ChangePasswordRegression.spec.ts",
        writePath: DIFF_FIXTURE_FOLDER_PATH,
        fileName: CHANGE_PASSWORD_SCREENSHOT_FILE_NAME,
      }).then((resultOrNull) => {
        console.log("write changepassword page diff result", resultOrNull);
      });
    });
  
    it("calculate the diff between base and actual", () => {
      const { width, height } = baselinePng;
      diff = new PNG({ width, height });
      console.log("changepassword page initial diff png", diff);
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
        cy.task("deleteDiff", "ChangePasswordRegression.spec.ts");
      }
      expect(matchNum).to.equal(0);
    });
  });
} else {
  describe("skipping regression in CI", () => {
    it("skips", () => {
      expect(true).to.eq(true);
    });
  });
}
