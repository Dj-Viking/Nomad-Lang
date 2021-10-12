import {
  LOCALHOST_URL,
  REGISTER_USERNAME,
  REGISTER_EMAIL,
  REGISTER_PASSWORD,
  EXPECTED_ADD_LOCAL_CARD_OBJECT,
  EXPECTED_EDIT_LOCAL_CARD_OBJECT,
  ACTUALS_CARDUNITSPEC_PATH_HEADLESS,
  ACTUALS_CARDUNITSPEC_PATH,
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
describe("deletes-screenshots", () => {
  it("deletes any actuals for this test before we enter the page", () => {
    console.log("checking cypress browser running", Cypress.browser);
    if (Cypress.browser.isHeadless) {
      cy.task("deleteActuals", ACTUALS_CARDUNITSPEC_PATH_HEADLESS).then(
        (dirOrNull) => {
          console.log("delete actuals response dir or null", dirOrNull);
        }
      );
    }
    if (Cypress.browser.isHeaded) {
      cy.task("deleteActuals", ACTUALS_CARDUNITSPEC_PATH).then((dirOrNull) => {
        console.log("delete actuals response dir or null", dirOrNull);
      });
    }
  });
});

describe("visits home page", () => {
  it("visits home page", () => {
    cy.visit(LOCALHOST_URL);
  });
});

describe("checks all CRUD operations of interactions with cards as not logged in", () => {
  it("clears todos on the screen", () => {
    cy.get("button.is-info").contains("clear cards").click();
  });
  it("while not logged in open the add card modal", () => {
    // eslint-disable-next-line
  // @ts-ignore //this is ignored because I didn't make the type yet
    cy.restoreLocalStorage();
    // cy.get("input[name=textInput]").type(inputText);

    //add a card start
    //open the modal
    cy.wait(400);
    cy.get("button").contains("Add New Card").click();
    //select input fields and type
    cy.get("input[name=modalAddFsText]").type(
      EXPECTED_ADD_LOCAL_CARD_OBJECT.frontSideText
    );
    cy.get("input[name=modalAddFsTextLanguage]").type(
      EXPECTED_ADD_LOCAL_CARD_OBJECT.frontSideLanguage
    );
    cy.get("input[name=modalAddFsTextPicture]").type(
      EXPECTED_ADD_LOCAL_CARD_OBJECT.frontSidePicture
    );
    cy.get("input[name=modalAddBsText]").type(
      EXPECTED_ADD_LOCAL_CARD_OBJECT.backSideText
    );
    cy.get("input[name=modalAddBsTextLanguage]").type(
      EXPECTED_ADD_LOCAL_CARD_OBJECT.backSideLanguage
    );
    cy.get("input[name=modalAddBsTextPicture]").type(
      EXPECTED_ADD_LOCAL_CARD_OBJECT.backSidePicture
    );
    //get the submit edit button
    cy.get("button[name=submitAddCard]").contains("SUBMIT ADD CARD").click();
    //add a card finish
  });
  it("checks that the card that was added has the text we input previously", () => {
    cy.wait(1000);
    //get the container of the cardlist and traverse down to the card that got added below the default one
    // cy.get("div.some-unique-class").children().eq(1).children().eq(1);

    // get the card container and traverse to get the text content that was input
    cy.get("div.notification.is-light").should("have.length", 1);

    cy.get("p.title.is-4").then((element) => {
      const textEntered = element.text().split(":")[1].trim();
      console.log(textEntered);
      expect(textEntered).to.be.equal(
        EXPECTED_ADD_LOCAL_CARD_OBJECT.frontSideText
      );
    });

    //make an edit modal first to have input elements to select and type in...cant seem to find a use to test the window prompt in cypress
    it("checks that the edit button exists", () => {
      // clicks edit button
      cy.get("div.some-unique-class")
        .children()
        .eq(1)
        .children()
        .eq(2)
        .children()
        .eq(2);
    });
  });

  it("checks we can delete a card", () => {
    //deletes and asserts that the card with the edited text is gone

    //delete button click
    cy.get("button.button.is-danger.mx-2").click(); // cy.get("div.some-unique-class").children().eq(1).children();
  });

  it("adds a couple more cards and then hits clear button", () => {
    // eslint-disable-next-line
  // @ts-ignore //this is ignored because I didn't make the type yet
    cy.restoreLocalStorage();
    //add a card start
    //open the modal
    cy.get("button").contains("Add New Card").click();
    //select input fields and type
    cy.get("input[name=modalAddFsText]").type("front side text");
    cy.get("input[name=modalAddFsTextLanguage]").type(
      "front side text language"
    );
    cy.get("input[name=modalAddFsTextPicture]").type("front side picture");
    cy.get("input[name=modalAddBsText]").type("back side text");
    cy.get("input[name=modalAddBsTextLanguage]").type(
      "back side text language"
    );
    cy.get("input[name=modalAddBsTextPicture]").type("back side picture");
    //get the submit add button
    cy.get("button[name=submitAddCard]").click();
    cy.wait(400);
    // //add a card finish
  });
  it("checks that the cards are gone after clear button click", () => {
    cy.get("button.is-info").contains("clear cards").click();
    cy.get("div.some-unique-class").children().should("have.length", 2);
  });
});

describe("registers a new user that will crud the cards", () => {
  //sign in as new user
  //check that the cards are empty for a newly signed in user comes to home page
  it("clicks signup link ", () => {
    cy.get("a.link").contains("Signup").click();
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
  it("creates DO ALL CRUD operations here since this is the only time the token will be available to make requests", () => {
    // eslint-disable-next-line
  // @ts-ignore //this is ignored because I didn't make the type yet
    cy.restoreLocalStorage();
    cy.window().then((window: Cypress.AUTWindow) => {
      expect(window.localStorage.getItem("id_token")).to.equal(token);
    });
    // cy.get("input[name=textInput]").type(inputText);
    // cy.get("button").contains("Add Card").click();
    //add a card start
    //open the modal
    cy.get("button").contains("Add New Card").click();
    //select input fields and type
    cy.get("input[name=modalAddFsText]").type(
      EXPECTED_ADD_LOCAL_CARD_OBJECT.frontSideText
    );
    cy.get("input[name=modalAddFsTextLanguage]").type(
      EXPECTED_ADD_LOCAL_CARD_OBJECT.frontSideLanguage
    );
    cy.get("input[name=modalAddFsTextPicture]").type(
      EXPECTED_ADD_LOCAL_CARD_OBJECT.frontSidePicture
    );
    cy.get("input[name=modalAddBsText]").type(
      EXPECTED_ADD_LOCAL_CARD_OBJECT.backSideText
    );
    cy.get("input[name=modalAddBsTextLanguage]").type(
      EXPECTED_ADD_LOCAL_CARD_OBJECT.backSideLanguage
    );
    cy.get("input[name=modalAddBsTextPicture]").type(
      EXPECTED_ADD_LOCAL_CARD_OBJECT.backSidePicture
    );
    //get the submit add button
    cy.get("button[name=submitAddCard]").click();
    //add a card finish

    //wait a bit for it to appear in the DOM
    cy.wait(400);
    cy.get("div.some-unique-class")
      .children()
      .eq(2)
      .children()
      .eq(1)
      .children();

    //edit standalone operations

    //click the edit card button on a card
    cy.get("button.button.is-primary.mx-2").click();

    cy.get("input[name=modalEditFsText]").type(
      EXPECTED_EDIT_LOCAL_CARD_OBJECT.frontSideText
    );
    cy.get("input[name=modalEditFsTextLanguage]").type(
      EXPECTED_EDIT_LOCAL_CARD_OBJECT.frontSideLanguage
    );
    cy.get("input[name=modalEditFsTextPicture]").type(
      EXPECTED_EDIT_LOCAL_CARD_OBJECT.frontSidePicture
    );
    cy.get("input[name=modalEditBsText]").type(
      EXPECTED_EDIT_LOCAL_CARD_OBJECT.backSideText
    );
    cy.get("input[name=modalEditBsTextLanguage]").type(
      EXPECTED_EDIT_LOCAL_CARD_OBJECT.backSideLanguage
    );
    cy.get("input[name=modalEditBsTextPicture]").type(
      EXPECTED_EDIT_LOCAL_CARD_OBJECT.backSidePicture
    );

    cy.get("button").contains("SUBMIT EDIT CARD").click();
    cy.wait(500);

    // just check that we got the card with the edited text on it
    cy.get("p.title.is-4").then((element) => {
      const textEntered = element.text().split(":")[1].trim();
      console.log(textEntered);
      expect(textEntered).to.be.equal(
        EXPECTED_EDIT_LOCAL_CARD_OBJECT.frontSideText
      );
    });
    //   //delete button click
    cy.get("button.button.is-danger.mx-2").click();
    //checks it was deleted
    cy.get("div.some-unique-class")
      .children()
      .eq(1)
      .children()
      .should("have.length", 1);

    //add a card start
    //open the modal
    cy.get("button").contains("Add New Card").click();

    //add card start
    //select input fields and type
    cy.get("input[name=modalAddFsText]").type(
      EXPECTED_EDIT_LOCAL_CARD_OBJECT.frontSideText
    );
    cy.get("input[name=modalAddFsTextLanguage]").type(
      EXPECTED_EDIT_LOCAL_CARD_OBJECT.frontSideLanguage
    );
    cy.get("input[name=modalAddFsTextPicture]").type(
      EXPECTED_EDIT_LOCAL_CARD_OBJECT.frontSidePicture
    );
    cy.get("input[name=modalAddBsText]").type(
      EXPECTED_EDIT_LOCAL_CARD_OBJECT.backSideText
    );
    cy.get("input[name=modalAddBsTextLanguage]").type(
      EXPECTED_EDIT_LOCAL_CARD_OBJECT.backSideLanguage
    );
    cy.get("input[name=modalAddBsTextPicture]").type(
      EXPECTED_EDIT_LOCAL_CARD_OBJECT.backSidePicture
    );
    //get the submit add button
    cy.get("button[name=submitAddCard]").click();
    //add a card finish

    //check that the card can be deleted
    //   //delete button click
    cy.wait(500);
    cy.get("button.button.is-danger.mx-2").click();
    //checks it was deleted
    cy.get("div.some-unique-class")
      .children()
      .eq(1)
      .children()
      .should("have.length", 1);

    //add card start
    cy.get("button").contains("Add New Card").click();
    //select input fields and type
    cy.get("input[name=modalAddFsText]").type(
      EXPECTED_EDIT_LOCAL_CARD_OBJECT.frontSideText
    );
    cy.get("input[name=modalAddFsTextLanguage]").type(
      EXPECTED_EDIT_LOCAL_CARD_OBJECT.frontSideLanguage
    );
    cy.get("input[name=modalAddFsTextPicture]").type(
      EXPECTED_EDIT_LOCAL_CARD_OBJECT.frontSidePicture
    );
    cy.get("input[name=modalAddBsText]").type(
      EXPECTED_EDIT_LOCAL_CARD_OBJECT.backSideText
    );
    cy.get("input[name=modalAddBsTextLanguage]").type(
      EXPECTED_EDIT_LOCAL_CARD_OBJECT.backSideLanguage
    );
    cy.get("input[name=modalAddBsTextPicture]").type(
      EXPECTED_EDIT_LOCAL_CARD_OBJECT.backSidePicture
    );
    //get the submit add button
    cy.get("button[name=submitAddCard]").click();
    //add a card finish

    //clear cards as logged in user
    cy.get("button.is-info").contains("clear cards").click();
    cy.wait(500);
    cy.get("div.some-unique-class")
      .children()
      .eq(1)
      .children()
      .should("have.length", 1);
  });
});

//   // check error if creates with expired token
// this error will happen if i try to add in a new it() test function block,
// then cypress will trash local storage unless i save local storage

// describe("checks local storage", () => {
//   it("checks window local storage here ", () => {
//     cy.restoreLocalStorage();
//     cy.window().then((window: Cypress.AUTWindow) => {
//       expect(window.localStorage.getItem("id_token")).to.equal(token);
//     });
//   });
// });

describe("logs out", () => {
  it("clicks logout", () => {
    cy.get("a.link").contains("Logout").click();
  });
});
