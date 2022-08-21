// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This is will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

import "cypress-file-upload";

import "@cypress/code-coverage/support";
// import "cypress-localstorage-commands";

import {
  LOCALHOST_URL,
  EXPECTED_ADD_LOCAL_CARD_OBJECT,
  EXPECTED_EDIT_LOCAL_CARD_OBJECT,
  REGISTER_USERNAME,
  REGISTER_EMAIL,
  EMAIL,
  USERNAME,
  PASSWORD,
  REGISTER_PASSWORD,
} from "../../constants";

let LOCAL_STORAGE_MEMORY = {};
let unique_username = "";
let unique_email = "";

// eslint-disable-next-line
Cypress.Commands.add("saveLocalStorage", () => {
  Object.keys(localStorage).forEach((key) => {
    LOCAL_STORAGE_MEMORY[key] = localStorage[key];
  });
});

// eslint-disable-next-line
Cypress.Commands.add("restoreLocalStorage", () => {
  Object.keys(LOCAL_STORAGE_MEMORY).forEach((key) => {
    localStorage.setItem(key, LOCAL_STORAGE_MEMORY[key]);
  });
});

Cypress.Commands.add("logout", () => {
  cy.wait(1000);
  cy.get("a.button.is-danger").contains("Logout").click();
});

Cypress.Commands.add("clickLoginButton", () => {
  cy.get("a.button.is-success")
    .contains("Login")
    .should("have.length", 1)
    .click();
});

Cypress.Commands.add("incorrectLogin", () => {
  //clear inputs after this is done so the next test can run just fine
  cy.get("input[name=email-or-username]")
    .should("have.length", 1)
    .type("ksdkjfkdjfd");
  cy.get("input[name=password]").should("have.length", 1).type("dsafsdf");
  cy.get("button").contains("Login").should("have.length", 1).click();
  cy.get("div.Vue-Toastification__toast--error").should("have.length", 1);
  cy.get("input[name=email-or-username]").clear();
  cy.get("input[name=password]").clear();
});

Cypress.Commands.add("loginWithOnlyEmail", () => {
  cy.get("input[name=email-or-username]").should("have.length", 1).type(EMAIL);
  cy.get("input[name=password]").should("have.length", 1).type(PASSWORD);
  cy.get("button").contains("Login").should("have.length", 1).click();
  cy.wait(1000);
  cy.get("div.Vue-Toastification__toast-body").should("have.length", 1);
});

Cypress.Commands.add("loginWithOnlyUsername", () => {
  cy.get("input[name=email-or-username]")
    .should("have.length", 1)
    .type(USERNAME);
  cy.get("input[name=password]").should("have.length", 1).type(PASSWORD);
  cy.get("button").contains("Login").should("have.length", 1).click();
  cy.wait(500);
  cy.get("div.Vue-Toastification__toast--success").should("have.length", 1);
  it("logs in using only username", () => {});
  it("types in password", () => {});
  it("clicks the submit button", () => {});
  it("checks that success message appears ", () => {});
});

Cypress.Commands.add("loginNew", () => {
  //use client side routing to get to login page
  //signed in already lets log out and then log in
  cy.get("a.button.is-danger")
    .contains("Logout")
    .should("have.length", 1)
    .click();
  cy.wait(500);
  cy.get("a.button.is-success")
    .contains("Login")
    .should("have.length", 1)
    .click();
  cy.get("input[name=email-or-username]")
    .should("have.length", 1)
    .type(unique_email);
  cy.get("input[name=password]")
    .should("have.length", 1)
    .type(REGISTER_PASSWORD);
  cy.get("button").contains("Login").should("have.length", 1).click();
  cy.wait(2000);
  cy.saveLocalStorage();
  cy.wait(100);
  cy.get("div.Vue-Toastification__toast-body").should("have.length", 1);
  cy.wait(2000);
  cy.get("button").contains("Add New Card");
});

Cypress.Commands.add("signupWhileOnSignupPage", () => {
  unique_username = `${REGISTER_USERNAME}-${Date.now()}`;
  cy.get("input[name=username]").should("have.length", 1).type(unique_username);
  unique_email = `${REGISTER_EMAIL}-${Date.now()}`;
  cy.get("input[name=email]").should("have.length", 1).type(unique_email);
  cy.get("input[name=password]")
    .should("have.length", 1)
    .type(REGISTER_PASSWORD);
  cy.get("button").contains("Sign Up!").should("have.length", 1).click();
  cy.wait(2000);
  cy.saveLocalStorage();
  cy.get("div.Vue-Toastification__toast-body").should("have.length", 1);
  cy.wait(2000);
  cy.get("button").contains("Add New Card");
});

Cypress.Commands.add("signup", () => {
  //sign in as new user
  //check that the cards are empty for a newly signed in user comes to home page
  cy.get("a.button.is-success").contains("Signup").click();
  unique_username = `${REGISTER_USERNAME}-${Date.now()}`;
  cy.get("input[name=username]").should("have.length", 1).type(unique_username);
  unique_email = `${REGISTER_EMAIL}-${Date.now()}`;
  cy.get("input[name=email]").should("have.length", 1).type(unique_email);
  cy.get("input[name=password]")
    .should("have.length", 1)
    .type(REGISTER_PASSWORD);
  cy.get("button").contains("Sign Up!").should("have.length", 1).click();
  cy.wait(2000);
  cy.saveLocalStorage();
  cy.get("div.Vue-Toastification__toast-body").should("have.length", 1);
  cy.wait(2000);
  cy.get("button").contains("Add New Card");
});

Cypress.Commands.add("deleteActuals", (args) => {
  console.log("checking cypress browser running", Cypress.browser);
  if (Cypress.browser.isHeadless) {
    cy.task("deleteActuals", args.headlessPath).then((dirOrNull) => {
      console.log("delete actuals response dir or null", dirOrNull);
    });
  }
  if (Cypress.browser.isHeaded) {
    cy.task("deleteActuals", args.headedPath).then((dirOrNull) => {
      console.log("delete actuals response dir or null", dirOrNull);
    });
  }
});

Cypress.Commands.add("goToHomePage", () => {
  cy.visit(LOCALHOST_URL);
});

Cypress.Commands.add("navigatePage", (suffix) => {
  cy.visit(`${LOCALHOST_URL}${suffix}`);
});

Cypress.Commands.add("addCard", () => {
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
  cy.wait(2000);
  //add a card finish
});

Cypress.Commands.add("editCard", () => {
  //edit standalone operations

  //click the edit card button on a card
  cy.get("button.button.is-primary.ml-6").contains("Edit").click();
  //clear everything
  cy.get("input[name=modalEditFsText]").clear();
  cy.get("input[name=modalEditFsTextLanguage]").clear();
  cy.get("input[name=modalEditFsTextPicture]").clear();
  cy.get("input[name=modalEditBsText]").clear();
  cy.get("input[name=modalEditBsTextLanguage]").clear();
  cy.get("input[name=modalEditBsTextPicture]").clear();

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
});

Cypress.Commands.add("deleteCard", () => {
  cy.get("i.fa.fa-trash").click();
  cy.wait(300);
  cy.get("button#delete-yes").contains("Yes").should("have.length", 1).click();
  cy.wait(300);
  //checks it was deleted
  cy.get("div.some-unique-class")
    .children()
    .eq(1)
    .children()
    .should("have.length", 3);
});

Cypress.Commands.add("clearCards", () => {
  cy.get("button.is-info.button-shrink").contains("Clear Cards").click();
  cy.get("button.button.is-info").contains("Yes").click();
  cy.wait(500);
  cy.get("div.some-unique-class")
    .children()
    .eq(1)
    .children()
    .should("have.length", 3);
});

Cypress.Commands.add("clickSignupButton", () => {
  cy.get("a.button.is-success")
    .contains("Signup")
    .should("have.length", 1)
    .click();
});

Cypress.Commands.add("invalidEmailSignup", () => {
  //clear inputs after this is done so the next test can run just fine
  cy.get("input[name=username]").should("have.length", 1).type("sldkjfkdjfd");
  cy.get("input[name=email]").should("have.length", 1).type("ksdkjfkdjfd");
  cy.get("input[name=password]").should("have.length", 1).type("dsafsdf");
  cy.get("button").contains("Sign Up!").should("have.length", 1).click();
  cy.get("div.Vue-Toastification__toast--error").should("have.length", 1);
  cy.get("input[name=username]").clear();
  cy.get("input[name=email]").clear();
  cy.get("input[name=password]").clear();
  cy.wait(1000);
});

Cypress.Commands.add("tooShortPasswordSignup", () => {
  cy.get("input[name=username]").should("have.length", 1).type("sldkjfkdjfd");
  cy.get("input[name=email]").should("have.length", 1).type("alskdjfsadk");
  cy.get("input[name=password]").should("have.length", 1).type("sdf");
  cy.get("button").contains("Sign Up!").should("have.length", 1).click();
  cy.get("div.Vue-Toastification__toast--error").should("have.length", 1);
  cy.get("input[name=username]").clear();
  cy.get("input[name=email]").clear();
  cy.get("input[name=password]").clear();
  cy.wait(1000);
});

Cypress.Commands.add("alreadyUsedEmailSignup", () => {
  cy.get("input[name=email]").type(EMAIL);
  cy.get("input[name=username]").type(USERNAME);
  cy.get("input[name=password]").type(Date.now().toString());
  cy.get("button").contains("Sign Up!").click();
  cy.get("div.Vue-Toastification__toast--error").should("have.length", 1);
  cy.get("input[name=email]").clear();
  cy.get("input[name=username]").clear();
  cy.get("input[name=password]").clear();
  cy.wait(1000);
  cy.get("input[name=email]").type(EMAIL);
  cy.get("input[name=username]").type(";adlksjfl;skdjf;");
  cy.get("input[name=password]").type(Date.now().toString());
  cy.get("button").contains("Sign Up!").click();
  cy.get("div.Vue-Toastification__toast--error").should("have.length", 1);
  cy.get("input[name=email]").clear();
  cy.get("input[name=username]").clear();
  cy.get("input[name=password]").clear();
  cy.wait(1000);
});

Cypress.Commands.add("openSideBar", () => {
  cy.get("i.fa.fa-chevron-right").click();
  cy.wait(1200);
  cy.get("i.fa.fa-chevron-left").should("have.length", 1);
});
