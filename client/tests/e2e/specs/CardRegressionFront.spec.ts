import {
  LOCALHOST_URL,
  REGISTER_USERNAME,
  REGISTER_EMAIL,
  REGISTER_PASSWORD,
  EXPECTED_ADD_LOCAL_CARD_OBJECT,
  CARD_FRONT_REGRESSION_SPEC_PATH,
  CARD_FRONT_REGRESSION_SPEC_PATH_HEADLESS,
  DIFF_FIXTURE_FOLDER_PATH,
  BASE_CARD_FRONT_FIXTURE,
  ACTUAL_CARD_FRONT_FIXTURE,
  CARD_FRONT_SCREENSHOT_FILE_NAME
} from "../../constants";
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
let matchNum = 0;

let unique_username = "";
let unique_email = "";
let token: string | null = "";


beforeEach(() => {
  // eslint-disable-next-line
  // @ts-ignore //this is ignored because I didn't make the type yet
  cy.restoreLocalStorage();
});

afterEach(() => {
  // eslint-disable-next-line
  // @ts-ignore //this is ignored because I didn't make the type yet
  cy.saveLocalStorage();
});

//delete actuals screenshots
describe("deletes-screenshots", () => {
  it("deletes any actuals for this test before we enter the page", () => {
    console.log("checking cypress browser running", Cypress.browser);
    if (Cypress.browser.isHeadless) {
      cy.task("deleteActuals", CARD_FRONT_REGRESSION_SPEC_PATH_HEADLESS).then(
        (dirOrNull) => {
          console.log("delete actuals response dir or null", dirOrNull);
        }
      );
    }
    if (Cypress.browser.isHeaded) {
      cy.task("deleteActuals", CARD_FRONT_REGRESSION_SPEC_PATH).then((dirOrNull) => {
        console.log("delete actuals response dir or null", dirOrNull);
      });
    }
  });
});

// load home page and sign up new user
describe("visits home page", () => {
  it("visits home page", () => {
    cy.visit(LOCALHOST_URL);
  });
});

describe("sign up new user", () => {
  //sign in as new user
  //check that the cards are empty for a newly signed in user comes to home page
  it("clicks signup link ", () => {
    cy.get("a.button.is-success").contains("Signup").click();
  });
  it("types in username", () => {
    unique_username = `${REGISTER_USERNAME}-${Date.now()}`;
    cy.get("input[name=username]")
      .should("have.length", 1)
      .type(unique_username);
  });
  it("types in email", () => {
    unique_email = `${REGISTER_EMAIL}-${Date.now()}`;
    cy.get("input[name=email]").should("have.length", 1).type(unique_email);
  });
  it("types in password", () => {
    cy.get("input[name=password]")
      .should("have.length", 1)
      .type(REGISTER_PASSWORD);
  });
  it("clicks the submit button", () => {
    cy.get("button").contains("Sign Up!").should("have.length", 1).click();
    cy.wait(2000);
    // eslint-disable-next-line
    // @ts-ignore //this is ignored because I didn't make the type yet
    cy.saveLocalStorage();
  });
  it("checks that success message appears ", () => {
    cy.get("div.Vue-Toastification__toast-body").should("have.length", 1);
  });
  it("waits a bit and checks we are back at the home page, i.e. checking if the add card button is on the page, and that local storage has a token, and localstorage has a global email set DO ALL LOGGED IN CARDS FEATURES", () => {
    cy.wait(2000);
    cy.get("button").contains("Add New Card");
    //not sure why the assertion only works here but okay
    // cypress trashes local storage during the test to prevent buildup of state or something like that
    cy.window().then((window: Cypress.AUTWindow) => {
      console.log("what is the token here", token);
      token = window.localStorage.getItem("id_token");
      console.log("what is the token here", token);
      expect(token).to.not.be.null;
      // eslint-disable-next-line
      // @ts-ignore //this is ignored because I didn't make the type yet
      cy.saveLocalStorage();
    });
  });
});

describe("add a card to screenshot the front", () => {
  it("adds one card", () => {
    //open the modal
    cy.get("button").contains("Add New Card").click();
    //select input fields and type
    cy.get("input[name=modalAddFsText]").type(
      EXPECTED_ADD_LOCAL_CARD_OBJECT.frontSideText as string
    );
    cy.get("input[name=modalAddFsTextLanguage]").type(
      EXPECTED_ADD_LOCAL_CARD_OBJECT.frontSideLanguage as string
    );
    cy.get("input[name=modalAddFsTextPicture]").type(
      EXPECTED_ADD_LOCAL_CARD_OBJECT.frontSidePicture as string
    );
    cy.get("input[name=modalAddBsText]").type(
      EXPECTED_ADD_LOCAL_CARD_OBJECT.backSideText as string
    );
    cy.get("input[name=modalAddBsTextLanguage]").type(
      EXPECTED_ADD_LOCAL_CARD_OBJECT.backSideLanguage as string
    );
    cy.get("input[name=modalAddBsTextPicture]").type(
      EXPECTED_ADD_LOCAL_CARD_OBJECT.backSidePicture as string
    );
    //get the submit add button
    cy.get("button[name=submitAddCard]").click();
    cy.wait(2000);
    //add a card finish
  });
});

//screenshot the card itself after it is added and loaded after the loading transition
describe("screenshot-front-of-card", () => {
  it("finds-the-first-card-in-the-list-and-screenshots-the-element", () => {
    // default theme for new user is light theme
    cy.get("div.notification.is-light").should("have.length", 1).screenshot({ capture: "runner" });
  });
});

describe("compares base with actual", () => {
  it("get the baseline png of the home page", () => {
    cy.fixture(
      /screenshot-front-of-card/g.test(BASE_CARD_FRONT_FIXTURE)
        ? BASE_CARD_FRONT_FIXTURE
        : "no card front base png found"
    )
      .then(Cypress.Blob.base64StringToBlob)
      .then(async (fileBlob: Blob) => {
        const fileArrayBuffer = await fileBlob.arrayBuffer();
        baselinePng = PNG.sync.read(
          Buffer.from(new Uint8Array(fileArrayBuffer)));
        baseDimensions.height = baselinePng.height;
        baseDimensions.width = baselinePng.width;
        console.log("baseline card front png", baselinePng);
      });
  });

  it("get the actual screenshotted png of the home page", () => {
    cy.fixture(
      /screenshot-front-of-card/g.test(ACTUAL_CARD_FRONT_FIXTURE)
        ? ACTUAL_CARD_FRONT_FIXTURE
        : "no card front actual png not found"
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
      testName: "CardRegressionFront.spec.ts",
      writePath: DIFF_FIXTURE_FOLDER_PATH,
      fileName: CARD_FRONT_SCREENSHOT_FILE_NAME,
    });

    cy.task("writeDiff", {
      testName: "CardRegressionFront.spec.ts",
      writePath: DIFF_FIXTURE_FOLDER_PATH,
      fileName: CARD_FRONT_SCREENSHOT_FILE_NAME,
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
      cy.task("deleteDiff", "CardRegressionFront.spec.ts");
    }
    expect(matchNum).to.equal(0);
  });
});
