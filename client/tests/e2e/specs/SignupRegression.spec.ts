import {
  LOCALHOST_URL,
  BASE_SIGNUP_FULL_PAGE_FIXTURE,
  ACTUAL_SIGNUP_FULL_PAGE_FIXTURE,
  DIFF_FIXTURE_FOLDER_PATH,
  ACTUALS_SIGNUPREGRESSIONSPEC_PATH,
  ACTUALS_SIGNUPREGRESSIONSPEC_PATH_HEADLESS,
  SIGNUP_SCREENSHOT_FILE_NAME,
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
let matchNum;

describe("signup-page-regression", () => {
  it("deletes any actuals for this test before we enter the page", () => {
    if (Cypress.browser.isHeadless) {
      cy.task("deleteActuals", ACTUALS_SIGNUPREGRESSIONSPEC_PATH_HEADLESS).then(
        (dirOrNull) => {
          console.log(
            "delete actuals response dir or null for signup regression test",
            dirOrNull
          );
        }
      );
    }
    if (Cypress.browser.isHeaded) {
      cy.task("deleteActuals", ACTUALS_SIGNUPREGRESSIONSPEC_PATH).then(
        (dirOrNull) => {
          console.log(
            "delete actuals response dir or null for signup regression test",
            dirOrNull
          );
        }
      );
    }
  });
  it("visits the site home page", () => {
    cy.visit(LOCALHOST_URL);
  });
  it("clicks Signup router link to navigate to the Signup page", () => {
    cy.get("a.link").contains("Signup").should("have.length", 1).click();
  });
  it("screenshots-the-signup-page", () => {
    cy.get("html").screenshot({ capture: "viewport" });
  });
});

describe("compares base with actual", () => {
  it("get the baseline png of the signup page", () => {
    cy.fixture(
      /signup-page-regression/g.test(BASE_SIGNUP_FULL_PAGE_FIXTURE)
        ? BASE_SIGNUP_FULL_PAGE_FIXTURE
        : "signup page fixture not found"
    )
      .then(Cypress.Blob.base64StringToBlob)
      .then(async (fileBlob: Blob) => {
        const fileArrayBuffer = await fileBlob.arrayBuffer();
        baselinePng = PNG.sync.read(
          Buffer.from(new Uint8Array(fileArrayBuffer))
        );
        baseDimensions.height = baselinePng.height;
        baseDimensions.width = baselinePng.width;
        console.log("baseline signup page png", baselinePng);
      });
  });
  it("get the actual screenshotted png of the signup page", () => {
    cy.fixture(
      /signup-page-regression/g.test(ACTUAL_SIGNUP_FULL_PAGE_FIXTURE)
        ? ACTUAL_SIGNUP_FULL_PAGE_FIXTURE
        : "actual signup page fixture not found"
    )
      .then(Cypress.Blob.base64StringToBlob)
      .then(async (fileBlob: Blob) => {
        const fileArrayBuffer = await fileBlob.arrayBuffer();
        actualPng = PNG.sync.read(Buffer.from(new Uint8Array(fileArrayBuffer)));
        actualDimensions.height = actualPng.height;
        actualDimensions.width = actualPng.width;
        console.log("signup page actual png", actualPng);
      });
  });
  it("write the diff to disk only if the dimensions are the same", () => {
    expect(baseDimensions.height).to.equal(actualDimensions.height);
    expect(baseDimensions.width).to.equal(actualDimensions.width);
    console.log("write diff task args", {
      testName: "SignupRegression.spec.ts",
      writePath: DIFF_FIXTURE_FOLDER_PATH,
      fileName: SIGNUP_SCREENSHOT_FILE_NAME,
    });

    cy.task("writeDiff", {
      testName: "SignupRegression.spec.ts",
      writePath: DIFF_FIXTURE_FOLDER_PATH,
      fileName: SIGNUP_SCREENSHOT_FILE_NAME,
    }).then((resultOrNull) => {
      console.log("write signup page diff result", resultOrNull);
    });
  });

  it("calculate the diff between base and actual", () => {
    const { width, height } = baselinePng;
    diff = new PNG({ width, height });
    console.log("signup page initial diff png");
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
      cy.task("deleteDiff", "SignupRegression.spec.ts");
    }
    expect(matchNum).to.equal(0);
  });
});
