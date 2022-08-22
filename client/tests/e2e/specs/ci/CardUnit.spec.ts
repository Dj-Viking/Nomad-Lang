import { ClearCardsResponse } from "@/types";
import { IMeResponse, IUserDeleteCardResponse, IUserEditCardResponse } from "../../../../../server/src/types";
import {
  EXPECTED_ADD_LOCAL_CARD_OBJECT,
  EXPECTED_EDIT_LOCAL_CARD_OBJECT,
  // ACTUALS_CARDUNITSPEC_PATH_HEADLESS,
  // ACTUALS_CARDUNITSPEC_PATH,
  MOCK_USER,
} from "../../../constants";

let token: string | null = "";

beforeEach(() => cy.restoreLocalStorage());

afterEach(() => cy.saveLocalStorage());

describe("deletes-screenshots", () => {
  // it("deletes any actuals for this test before we enter the page", () => {
  //   cy.deleteActuals({
  //     headlessPath: ACTUALS_CARDUNITSPEC_PATH,
  //     headedPath: ACTUALS_CARDUNITSPEC_PATH_HEADLESS
  //   });
  // });
  it("visits the home page", () => {
    cy.goToHomePage();
  });
  // it("screenshots-the-entire-page", () => {
  //   cy.get("html").screenshot({ capture: "runner" });
  // });
});

describe("checks all CRUD operations of interactions with cards as not logged in", () => {
  it("clears todos on the screen", () => {
    cy.clearCards();
  });
  it("while not logged in open the add card modal", () => {
    cy.restoreLocalStorage()
      .addCard();
  });
  it("checks that the card that was added has the text we input previously", () => {
    cy.wait(1000);
    //get the container of the cardlist and traverse down to the card that got added below the default one
    // cy.get("div.some-unique-class").children().eq(1).children().eq(1);

    // get the card container and traverse to get the text content that was input
    cy.get("div.notification.is-light").should("have.length", 1);

    cy.get("p.title.is-5").then((element) => {
      const textEntered = element.text();
      console.log(textEntered);
      expect(textEntered).to.be.equal(
        EXPECTED_ADD_LOCAL_CARD_OBJECT.frontSideText
      );
    });
  });
  //make an edit modal first to have input elements to select and type in...cant seem to find a use to test the window prompt in cypress
  it("checks that the edit button exists", () => {
    // clicks edit button
    cy.get("button.button.is-primary.ml-6")
      .contains("Edit")
      .should("have.length", 1);
  });

  it("checks we can delete a card", () => {
    //deletes and asserts that the card with the edited text is gone

    //delete button click
    cy.get("i.fa.fa-trash").click();
    // cy.wait(300);
    cy.get("button#delete-yes").contains("Yes").should("have.length", 1).click();
    // cy.wait(300);
  });

  it("adds a couple more cards and then hits clear button", () => {
    cy.restoreLocalStorage();
    cy.addCard();
  });
  it("checks that the cards are gone after clear button click", () => {
    // cy.wait(500);
    cy.get("button.is-info.button-shrink").contains("Clear Cards").click();
    cy.wait(300);
    cy.get("button.button.is-info").contains("Yes").click();
  });
});

describe("registers a new user that will crud the cards", () => {
  it("sign up user", () => {
    cy.intercept("**/user/signup", (req) => {
      req.reply(MOCK_USER);
    }).as("signup");
    cy.intercept("**/user/me", (req) => {
      req.reply({
        user: {
          ...MOCK_USER,
          cards: [...MOCK_USER.cards, EXPECTED_EDIT_LOCAL_CARD_OBJECT]
        }
      } as IMeResponse);
    }).as("me");
    cy.signup();
    //not sure why the assertion only works here but okay
    // cypress trashes local storage during the test to prevent buildup of state or something like that
    cy.restoreLocalStorage().wait("@signup").wait("@me");
    cy.window().then((window) => {
      token = window.localStorage.getItem("id_token");
      expect(token).to.not.be.null;
      cy.saveLocalStorage();
    });
  });
  it("creates DO ALL CRUD operations here since this is the only time the token will be available to make requests", () => {
    cy.restoreLocalStorage();
    cy.window().then((window: Cypress.AUTWindow) => {
      expect(window.localStorage.getItem("id_token")).to.equal(token);
    });
    cy.intercept("**/user/addCard", (req) => {
      req.reply({
        cards: [EXPECTED_ADD_LOCAL_CARD_OBJECT]
      });
    }).as("addCard");
    
    cy.intercept("**/user/me", (req) => {
      req.reply({
        user: {
          ...MOCK_USER,
          cards: [...MOCK_USER.cards, EXPECTED_EDIT_LOCAL_CARD_OBJECT] //HACK FOR THIS PARTICULAR TEST
        }
      } as IMeResponse);
    }).as("me");

    cy.intercept("**/user/editCard/**", (req) => {
      req.reply({
        cards: [EXPECTED_EDIT_LOCAL_CARD_OBJECT]
      } as IUserEditCardResponse);
    }).as("editCard");

    cy.intercept("**/user/deleteCard/**", (req) => {
      req.reply({
        cards: []
      } as IUserDeleteCardResponse);
    }).as("deleteCard");

    cy.intercept("**/user/clearCards", (req) => {
      req.reply({
        user: {
          ...MOCK_USER,
          cards: []
        }
      } as ClearCardsResponse);
    }).as("clearCards");
    cy.addCard();

    //wait a bit for it to appear in the DOM
    // cy.wait(1000);
    cy.get("div.some-unique-class").children().eq(2).children().wait("@addCard");

    cy.editCard();
    cy.wait(1);
    // just check that we got the card with the edited text on it
    cy.get("p.title.is-5").should("have.text", EXPECTED_EDIT_LOCAL_CARD_OBJECT.frontSideText).wait("@editCard");
    
    cy.deleteCard()
      .addCard()
      .deleteCard()
      .addCard()
      .clearCards();

  });
});

//   // check error if creates with expired token
// this error will happen if i try to add in a new it() test function block,
// then cypress will trash local storage unless i save local storage

describe("checks local storage", () => {
  it("checks window local storage here ", () => {
    cy.restoreLocalStorage();
    cy.window().then((window: Cypress.AUTWindow) => {
      expect(window.localStorage.getItem("id_token")).to.equal(token);
    });
  });
});

describe("logs out", () => {
  it("clicks logout", () => {
    cy.get("a.button.is-danger").contains("Logout").click();
  });
});
