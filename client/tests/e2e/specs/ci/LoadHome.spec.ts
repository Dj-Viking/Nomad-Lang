/* eslint-disable @typescript-eslint/ban-ts-comment */
import {
  LOCALHOST_URL,
  // ACTUALS_LOADHOMESPEC_PATH_HEADLESS,
  // ACTUALS_LOADHOMESPEC_PATH,
  MOCK_USER,
} from "../../../constants";

beforeEach(() => cy.restoreLocalStorage());

afterEach(() => cy.saveLocalStorage());

describe("deletes-screenshots", () => {
  // it("deletes any actuals for this test before we enter the page", () => {
  //   cy.deleteActuals({
  //     headedPath: ACTUALS_LOADHOMESPEC_PATH,
  //     headlessPath: ACTUALS_LOADHOMESPEC_PATH_HEADLESS
  //   });
  // });
  it("visit's home page", () => {
    cy.goToHomePage();
  });
  // it("screenshots-the-entire-page", () => {
  //   cy.get("html").screenshot({ capture: "runner" });
  // });
});

describe("Check-the-nav-bar-for-the-correct-nav-links", () => {
  it("visit's home page", () => {
    cy.visit(LOCALHOST_URL);
  });
  it("checks the login link", () => {
    cy.get("a.button.is-success").contains("Login").should("have.length", 1);
  });
  it("checks the signup link", () => {
    cy.get("a.button.is-success").contains("Signup").should("have.length", 1);
  });
});

describe("unit-test-home-link", () => {
  it("can click login and then click the home link to come backt to home page", () => {
    cy.get("a.button.is-success").contains("Login").click();
    cy.get("a.button.is-success")
      .contains("Home")
      .should("have.length", 1)
      .click();
    cy.get("a.button.is-success")
      .contains("Signup")
      .should("have.length", 1)
      .click();
    cy.get("a.button.is-success")
      .contains("Home")
      .should("have.length", 1)
      .click();
  });
});

describe("logs in to check if the logout link appears when logged in then logs out", () => {
  it("logs in", () => {

    cy.intercept("**/user/login", (req) => {
      req.reply(JSON.stringify({
        status: 200,
        statusCode: 200,
        user: MOCK_USER,
        error: null
      }));
    }).as("emailLogin");
    
    cy.intercept("**/user/me", (req) => {
      req.reply({
        user: {
          ...MOCK_USER
        }
      });
    }).as("me");

    cy.clickLoginButton();
    cy.loginWithOnlyEmail();
    cy.wait(2000);
    cy.get("button").contains("Add New Card");
    //not sure why the assertion only works here but okay
    // cypress trashes local storage during the test to prevent buildup of state or something like that
    cy.window().then((window: Cypress.AUTWindow) => {
      const token = window.localStorage.getItem("id_token");
      expect(token).to.not.be.null;
    });
    cy.logout();
  });
});
