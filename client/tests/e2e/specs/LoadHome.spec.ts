import {
  LOCALHOST_URL,
  EMAIL,
  PASSWORD,
  ACTUALS_LOADHOMESPEC_PATH_HEADLESS,
  ACTUALS_LOADHOMESPEC_PATH,
} from "../../constants";
describe("deletes-screenshots", () => {
  it("deletes any actuals for this test before we enter the page", () => {
    console.log("checking cypress browser running", Cypress.browser);
    if (Cypress.browser.isHeadless) {
      cy.task("deleteActuals", ACTUALS_LOADHOMESPEC_PATH_HEADLESS).then(
        (dirOrNull) => {
          console.log("delete actuals response dir or null", dirOrNull);
        }
      );
    }
    if (Cypress.browser.isHeaded) {
      cy.task("deleteActuals", ACTUALS_LOADHOMESPEC_PATH).then((dirOrNull) => {
        console.log("delete actuals response dir or null", dirOrNull);
      });
    }
  });
});

describe("Check-the-nav-bar-for-the-correct-nav-links", () => {
  it("visit's home page", () => {
    cy.visit(LOCALHOST_URL);
  });
  it("checks the login link", () => {
    cy.get("a.link").contains("Login").should("have.length", 1);
  });
  it("checks the signup link", () => {
    cy.get("a.link").contains("Signup").should("have.length", 1);
  });
});

describe("unit-test-home-link", () => {
  it("can click login and then click the home link to come backt to home page", () => {
    cy.get("a.link").contains("Login").click();
    cy.get("a.link").contains("Home").should("have.length", 1).click();
    cy.get("a.link").contains("Signup").should("have.length", 1).click();
    cy.get("a.link").contains("Home").should("have.length", 1).click();
  });
});

describe("logs in to check if the logout link appears when logged in then logs out", () => {
  it("logs in", () => {
    cy.get("a.link").contains("Login").click();
  });
  it("types in email", () => {
    cy.get("input[name=email-or-username]")
      .should("have.length", 1)
      .type(EMAIL);
  });
  it("types in password", () => {
    cy.get("input[name=password]").should("have.length", 1).type(PASSWORD);
  });
  it("clicks the submit button", () => {
    cy.get("button").contains("Login").should("have.length", 1).click();
  });
  it("checks that success message appears ", () => {
    cy.wait(1000);
    cy.get("div.Vue-Toastification__toast-body").should("have.length", 1);
  });
  it("waits a bit and checks we are back at the home page, i.e. checking if the add new card button is on the page, and that local storage has a token, and localstorage has a global email set", () => {
    cy.wait(2000);
    cy.get("button").contains("Add New Card");
    //not sure why the assertion only works here but okay
    // cypress trashes local storage during the test to prevent buildup of state or something like that
    cy.window().then((window: Cypress.AUTWindow) => {
      const token = window.localStorage.getItem("id_token");
      const email = window.localStorage.getItem("global_email");
      expect(email).to.equal(EMAIL);
      expect(token).to.not.be.null;
    });
  });

  it("see logout link and clicks it", () => {
    cy.wait(1000);
    cy.get("a.link").contains("Logout").click();
  });
});
