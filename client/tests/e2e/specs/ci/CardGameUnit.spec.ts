/* eslint-disable no-useless-escape */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { RegisterResponse } from "@/types";
import { IMeResponse } from "../../../../../server/src/types";
import {
  EXPECTED_ADD_LOCAL_CARD_OBJECT,
  ACTUALS_CARD_GAME_UNIT_SPEC_PATH_HEADLESS,
  ACTUALS_CARD_GAME_UNIT_SPEC_PATH,
  MOCK_USER,
} from "../../../constants";

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
  it("signs up a user", () => {
    
    cy.intercept("**/user/signup", (req) => {
      req.reply({
        user: MOCK_USER
      } as RegisterResponse);
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


// add a card to test the flipping and 
// checking the translation answer if right or wrong
describe("adding a card and checking the flip and translation error or success", () => {
  it("adds a card", () => {
    cy.intercept("**/user/addCard", (req) => {
      req.reply({
        cards: [EXPECTED_ADD_LOCAL_CARD_OBJECT]
      });
    }).as("addCard");
    cy.intercept("**/user/me", (req) => {
      req.reply({
        user: {
          ...MOCK_USER,
          cards: [EXPECTED_ADD_LOCAL_CARD_OBJECT]
        }
      } as IMeResponse);
    }).as("me");
    cy.addCard();
  });
});
//screenshot the card itself after it is added and loaded after the loading transition
describe("screenshot-card", () => {
  it("finds the first card in the list and screenshots the element", () => {
    // default theme for new user is light theme
    cy.get("div.notification.is-light").should("have.length", 1).screenshot();
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
    //have to put slight wait because headless fails even though the screenshot shows Incorrect: 3 there
    // theres some render timing error in headless I guess
    cy.wait(1); 
    cy.get("span#incorrect-score").should("have.length", 1).then(el => {
      expect(el.text().trim()).to.eq(`Incorrect: 3`);
    });
  });
});

