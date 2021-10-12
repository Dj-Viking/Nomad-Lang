import {
  ACTUAL_FORGOTPASS_FULL_PAGE_FIXTURE,
  BASE_FORGOTPASS_FULL_PAGE_FIXTURE,
  LOCALHOST_URL,
  DIFF_FIXTURE_FOLDER_PATH,
  ACTUALS_FORGOT_PASSWORD_REGRESSION_SPEC_PATH,
  FORGOT_PASSWORD_SCREENSHOT_FILE_NAME,
  ACTUALS_FORGOT_PASSWORD_REGRESSION_SPEC_PATH_HEADLESS,
  // ACTUALS_LOADHOMESPEC_PATH_HEADLESS,
} from "tests/constants";
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

describe("forgotpass-page-regression", () => {
  it("deletes any actuals for this test before we enter the page", () => {
    console.log("checking cypress browser running", Cypress.browser);
    if (Cypress.browser.isHeadless) {
      cy.task(
        "deleteActuals",
        ACTUALS_FORGOT_PASSWORD_REGRESSION_SPEC_PATH_HEADLESS
      ).then((dirOrNull) => {
        console.log("delete actuals response dir or null", dirOrNull);
      });
    }
    if (Cypress.browser.isHeaded) {
      cy.task(
        "deleteActuals",
        ACTUALS_FORGOT_PASSWORD_REGRESSION_SPEC_PATH
      ).then((dirOrNull) => {
        console.log("delete actuals response dir or null", dirOrNull);
      });
    }
  });
  it("visits the forgot password page", () => {
    cy.visit(`${LOCALHOST_URL}/forgot`);
  });
  it("screenshots-the-entire-page", () => {
    cy.get("html").screenshot({ capture: "runner" });
  });
});

describe("compares base with actual", () => {
  it("get the baseline png of the home page", () => {
    cy.fixture(
      /forgotpass-page-regression/g.test(BASE_FORGOTPASS_FULL_PAGE_FIXTURE)
        ? BASE_FORGOTPASS_FULL_PAGE_FIXTURE
        : "forgotpass page base png found"
    )
      .then(Cypress.Blob.base64StringToBlob)
      .then(async (fileBlob: Blob) => {
        const fileArrayBuffer = await fileBlob.arrayBuffer();
        baselinePng = PNG.sync.read(
          Buffer.from(new Uint8Array(fileArrayBuffer))
        );
        baseDimensions.height = baselinePng.height;
        baseDimensions.width = baselinePng.width;
        console.log("baseline forgotpass page png", baselinePng);
      });
  });

  it("get the actual screenshotted png of the forgotpass page", () => {
    cy.fixture(
      /forgotpass-page-regression/g.test(ACTUAL_FORGOTPASS_FULL_PAGE_FIXTURE)
        ? ACTUAL_FORGOTPASS_FULL_PAGE_FIXTURE
        : "actual forgotpass png not found"
    )
      .then(Cypress.Blob.base64StringToBlob)
      .then(async (fileBlob: Blob) => {
        const fileArrayBuffer = await fileBlob.arrayBuffer();
        actualPng = PNG.sync.read(Buffer.from(new Uint8Array(fileArrayBuffer)));
        actualDimensions.height = actualPng.height;
        actualDimensions.width = actualPng.width;
        console.log("forgotpass page actual png", actualPng);
      });
  });

  it("write the diff to disk only if the dimensions are the same", () => {
    expect(baseDimensions.height).to.equal(actualDimensions.height);
    expect(baseDimensions.width).to.equal(actualDimensions.width);
    console.log("write diff task args", {
      testName: "ForgotPasswordRegression.spec.ts",
      writePath: DIFF_FIXTURE_FOLDER_PATH,
      fileName: FORGOT_PASSWORD_SCREENSHOT_FILE_NAME,
    });

    cy.task("writeDiff", {
      testName: "ForgotPasswordRegression.spec.ts",
      writePath: DIFF_FIXTURE_FOLDER_PATH,
      fileName: FORGOT_PASSWORD_SCREENSHOT_FILE_NAME,
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
      cy.task("deleteDiff", "ForgotPasswordRegression.spec.ts");
    }
    expect(matchNum).to.equal(0);
  });
});
