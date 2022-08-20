import {
  EXPECTED_ADD_LOCAL_CARD_OBJECT,
  CARD_BACK_REGRESSION_SPEC_PATH,
  CARD_BACK_REGRESSION_SPEC_PATH_HEADLESS,
  DIFF_FIXTURE_FOLDER_PATH,
  BASE_CARD_BACK_FIXTURE,
  ACTUAL_CARD_BACK_FIXTURE,
  CARD_BACK_SCREENSHOT_FILE_NAME,
  MOCK_USER
} from "../../constants";
import { PNG, PNGWithMetadata } from "pngjs";
import Pixelmatch from "pixelmatch";
import { IWriteDiffResult } from "tests/utils/writeDiff";
import { IMeResponse } from "../../../../server/src/types";

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
let matchNum = 0;

beforeEach(() => cy.restoreLocalStorage());

afterEach(() => cy.saveLocalStorage());

//delete actuals screenshots
describe("deletes-screenshots", () => {
  it("deletes any actuals for this test before we enter the page", () => {
    cy.deleteActuals({
      headedPath: CARD_BACK_REGRESSION_SPEC_PATH,
      headlessPath: CARD_BACK_REGRESSION_SPEC_PATH_HEADLESS
    });
  });
});

// load home page and sign up new user
describe("visits home page", () => {
  it("visits home page", () => {
    cy.goToHomePage();
  });
});
describe("sign up new user", () => {
  it("signs up user", () => {
    cy.intercept("**/user/signup", (req) => {
      req.reply(MOCK_USER);
    }).as("signup");
    cy.intercept("**/user/me", (req) => {
      req.reply({
        user: {
          ...MOCK_USER,
          cards: [...MOCK_USER.cards, EXPECTED_ADD_LOCAL_CARD_OBJECT]
        }
      } as IMeResponse);
    }).as("me");
    cy.signup();
    //not sure why the assertion only works here but okay
    // cypress trashes local storage during the test to prevent buildup of state or something like that
    let token: string | null = "";
    cy.restoreLocalStorage().wait("@signup").wait("@me");
    cy.window().then((window) => {
      token = window.localStorage.getItem("id_token");
      expect(token).to.not.be.null;
      cy.saveLocalStorage();
    });
  });
});

describe("add a card to screenshot the back", () => {
  it("adds one card", () => {
    cy.intercept("**/user/addCard", (req) => {
      req.reply({
        cards: [EXPECTED_ADD_LOCAL_CARD_OBJECT]
      });
    }).as("addCard");
    cy.intercept("**/user/me", (req) => {
      req.reply({
        user: {
          ...MOCK_USER,
          cards: [...MOCK_USER.cards, EXPECTED_ADD_LOCAL_CARD_OBJECT]
        }
      } as IMeResponse);
    }).as("me");
    cy.addCard();
  });
});

//screenshot the card itself after it is added and loaded after the loading transition
describe("screenshot-back-of-card", () => {
  it("finds-the-first-card-in-the-list-and-screenshots-the-element", () => {
    cy.get("button#check-answer-btn")
      .should("have.length", 1)
      .click();
    cy.wait(300);
    // default theme for new user is light theme
    cy.get("div.notification.is-light").should("have.length", 1).screenshot({ capture: "runner" });
  });
});

describe("compares base with actual", () => {
  it("get the baseline png of the home page", () => {
    cy.fixture(
      /screenshot-back-of-card/g.test(BASE_CARD_BACK_FIXTURE)
        ? BASE_CARD_BACK_FIXTURE
        : "no card back base png found"
    )
      .then(Cypress.Blob.base64StringToBlob)
      .then(async (fileBlob: Blob) => {
        const fileArrayBuffer = await fileBlob.arrayBuffer();
        baselinePng = PNG.sync.read(
          Buffer.from(new Uint8Array(fileArrayBuffer)));
        baseDimensions.height = baselinePng.height;
        baseDimensions.width = baselinePng.width;
        console.log("baseline card back png", baselinePng);
      });
  });

  it("get the actual screenshotted png of the home page", () => {
    cy.fixture(
      /screenshot-back-of-card/g.test(ACTUAL_CARD_BACK_FIXTURE)
        ? ACTUAL_CARD_BACK_FIXTURE
        : "card front actual png not found"
    )
      .then(Cypress.Blob.base64StringToBlob)
      .then(async (fileBlob: Blob) => {
        const fileArrayBuffer = await fileBlob.arrayBuffer();
        actualPng = PNG.sync.read(
          Buffer.from(new Uint8Array(fileArrayBuffer)));
        actualDimensions.height = actualPng.height;
        actualDimensions.width = actualPng.width;
        console.log("card front actual png", actualPng);
      });
  });

  it("write the diff to disk only if the dimensions are the same", () => {
    expect(baseDimensions.height).to.equal(actualDimensions.height);
    expect(baseDimensions.width).to.equal(actualDimensions.width);
    console.log("write diff task args", {
      testName: "CardRegressionBack.spec.ts",
      writePath: DIFF_FIXTURE_FOLDER_PATH,
      fileName: CARD_BACK_SCREENSHOT_FILE_NAME,
    });

    cy.task<IWriteDiffResult>("writeDiff", {
      testName: "CardRegressionBack.spec.ts",
      writePath: DIFF_FIXTURE_FOLDER_PATH,
      fileName: CARD_BACK_SCREENSHOT_FILE_NAME,
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
      cy.task("deleteDiff", "CardRegressionBack.spec.ts");
    }
    expect(matchNum).to.equal(0);
  });
});