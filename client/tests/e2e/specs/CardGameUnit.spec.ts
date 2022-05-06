import {
  LOCALHOST_URL,
  REGISTER_USERNAME,
  REGISTER_EMAIL,
  REGISTER_PASSWORD,
  EXPECTED_ADD_LOCAL_CARD_OBJECT,
  ACTUALS_CARD_GAME_UNIT_SPEC_PATH_HEADLESS,
  ACTUALS_CARD_GAME_UNIT_SPEC_PATH,
} from "../../constants";

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
      cy.task("deleteActuals", ACTUALS_CARD_GAME_UNIT_SPEC_PATH_HEADLESS).then(
        (dirOrNull) => {
          console.log("delete actuals response dir or null", dirOrNull);
        }
      );
    }
    if (Cypress.browser.isHeaded) {
      cy.task("deleteActuals", ACTUALS_CARD_GAME_UNIT_SPEC_PATH).then((dirOrNull) => {
        console.log("delete actuals response dir or null", dirOrNull);
      });
    }
  });
  it("visits the home page", () => {
    cy.visit(LOCALHOST_URL);
  });
});

// load home page and sign up new user
describe("visits home page", () => {
  it("visits home page", () => {
    console.log("localhost URL", LOCALHOST_URL);

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


// add a card to test the flipping and 
// checking the translation answer if right or wrong
describe("adding a card and checking the flip and translation error or success", () => {
  it("adds a card", () => {
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
describe("screenshot-card", () => {
  it("finds the first card in the list and screenshots the element", () => {
    // default theme for new user is light theme
    cy.get("div.notification.is-light").should("have.length", 1).screenshot({ capture: "runner" });
  });
});

describe("checking translation answer result", () => {
  it("checks the translation answer submit result", () => {
    cy.get("input#translation-input")
      .should("have.length", 1)
      .type("back side text");

    cy.get("button#check-answer-btn")
      .should("have.length", 1)
      .click();
  });
});

