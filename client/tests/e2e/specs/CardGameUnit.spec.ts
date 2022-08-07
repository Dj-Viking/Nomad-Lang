/* eslint-disable no-useless-escape */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import {
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

beforeEach(() => cy.restoreLocalStorage());

afterEach(() => cy.saveLocalStorage());

//delete actuals screenshots
describe("deletes-screenshots", () => {
  it("deletes any actuals for this test before we enter the page", () => {
    cy.deleteActuals({
      headedPath: ACTUALS_CARD_GAME_UNIT_SPEC_PATH,
      headlessPath: ACTUALS_CARD_GAME_UNIT_SPEC_PATH_HEADLESS
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
      cy.saveLocalStorage();
    });
  });
});


// add a card to test the flipping and 
// checking the translation answer if right or wrong
describe("adding a card and checking the flip and translation error or success", () => {
  it("adds a card", () => {
    cy.addCard();
  });
});
//screenshot the card itself after it is added and loaded after the loading transition
describe("screenshot-card", () => {
  it("finds the first card in the list and screenshots the element", () => {
    // default theme for new user is light theme
    cy.get("div.notification.is-light").should("have.length", 1).screenshot({ capture: "runner" });
  });
});

describe("checking if clicking the choice button answer results in correct and incorrect increment will increment", () => {

  it("checks that clicking the answer button has the same answer as backside text", () => {
    cy.wait(200);
    cy.get("button.button.is-info").then((collection) => {
      collection.children().each((_index, el) => {
        if (el.innerHTML === EXPECTED_ADD_LOCAL_CARD_OBJECT.backSideText) {
          expect(el.innerHTML).to.eq(EXPECTED_ADD_LOCAL_CARD_OBJECT.backSideText);
          el.click();
        }
      });
    });
    //have to put slight wait because headless fails even though the screenshot shows Correct: 1 there
    // theres some render timing error in headless I guess
    cy.wait(1); 
    cy.get("span#correct-score").should("have.length", 1).then(el => {
      expect(el.text().trim()).to.eq(`Correct: 1`);
    });
  });

  it("clicks the incorrect answer and checks if incorrect was incremented", () => {
    cy.get("button.button.is-info").then((collection) => {
      const coll_len = collection.length;
      for (let i = 0; i < coll_len; i++) {
        const choice_start = 3;
        const current_child = collection.eq(i);
        if (i >= choice_start) {
          if (current_child.text() !== EXPECTED_ADD_LOCAL_CARD_OBJECT.backSideText) {
            expect(current_child.text()).to.not.eq(EXPECTED_ADD_LOCAL_CARD_OBJECT.backSideText);
            current_child.trigger("click");
          }
        }
      }
    });
    //have to put slight wait because headless fails even though the screenshot shows Correct: 1 there
    // theres some render timing error in headless I guess
    cy.wait(1); 
    cy.get("span#incorrect-score").should("have.length", 1).then(el => {
      expect(el.text().trim()).to.eq(`Incorrect: 3`);
    });
  });
});

