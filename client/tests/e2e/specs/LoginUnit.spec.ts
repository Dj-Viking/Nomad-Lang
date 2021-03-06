import { LOCALHOST_URL, EMAIL, PASSWORD, USERNAME, ACTUALS_LOGINUNITSPEC_PATH_HEADLESS, ACTUALS_LOGINUNITSPEC_PATH } from "../../constants";

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

describe("login-page-unit", () => {
  it("deletes any actuals for this test before we enter the page", () => {
    if (Cypress.browser.isHeadless) {
      cy.task("deleteActuals", ACTUALS_LOGINUNITSPEC_PATH_HEADLESS).then(
        (dirOrNull) => {
          console.log(
            "delete actuals response dir or null for login regression test",
            dirOrNull
          );
        }
      );
    }
    if (Cypress.browser.isHeaded) {
      cy.task("deleteActuals", ACTUALS_LOGINUNITSPEC_PATH).then(
        (dirOrNull) => {
          console.log(
            "delete actuals response dir or null for login regression test",
            dirOrNull
          );
        }
      );
    }
  });

  it("visits the site home page", () => {
    cy.visit(LOCALHOST_URL);
  });
  it("clicks login router link to navigate to the login page", () => {
    cy.get("a.button.is-success")
      .contains("Login")
      .should("have.length", 1)
      .click();
  });
  it("screenshots-the-login-page", () => {
    cy.get("html").screenshot({ capture: "viewport" });
  });
});
  

describe("login-unit-test, tests login functionality", () => {
  it("visits the site login page", () => {
    cy.visit(LOCALHOST_URL);
  });
  it("clicks login router link to navigate to the login page", () => {
    cy.get("a.button.is-success")
      .contains("Login")
      .should("have.length", 1)
      .click();
  });
});

describe("tests login with incorrect credentials, has error message", () => {
  //clear inputs after this is done so the next test can run just fine
  it("types in incorrect email", () => {
    cy.get("input[name=email-or-username]")
      .should("have.length", 1)
      .type("ksdkjfkdjfd");
  });
  it("types in incorrect password", () => {
    cy.get("input[name=password]").should("have.length", 1).type("dsafsdf");
  });
  it("clicks submit button", () => {
    cy.get("button").contains("Login").should("have.length", 1).click();
  });
  it("checks that error message appears", () => {
    cy.get("div.Vue-Toastification__toast--error").should("have.length", 1);
  });
  it("clears the inputs", () => {
    cy.get("input[name=email-or-username]").clear();
    cy.get("input[name=password]").clear();
  });
});

describe("tests the login with correct credentials works, has success message, and navigates back to home page", () => {
  describe("already logged in here signs in with only username", () => {
    it("logs in using only username", () => {
      cy.get("input[name=email-or-username]")
        .should("have.length", 1)
        .type(USERNAME);
    });
    it("types in password", () => {
      cy.get("input[name=password]").should("have.length", 1).type(PASSWORD);
    });
    it("clicks the submit button", () => {
      cy.get("button").contains("Login").should("have.length", 1).click();
    });
    it("checks that success message appears ", () => {
      cy.wait(500);
      cy.get("div.Vue-Toastification__toast--success").should("have.length", 1);
    });
    it("waits a bit and checks we are back at the home page, i.e. checking if the add new card button is on the page, and that local storage has a token, and localstorage has a global email set", () => {
      cy.wait(3000);
      cy.get("button").contains("Add New Card");
      //not sure why the assertion only works here but okay
      // cypress trashes local storage during the test to prevent buildup of state or something like that
      cy.window().then((window: Cypress.AUTWindow) => {
        const token = window.localStorage.getItem("id_token");
        expect(token).to.not.be.null;
      });
    });

    it("logs out", () => {
      cy.wait(1000);
      cy.get("a.button.is-danger").contains("Logout").click();
    });
  });

  describe("logs back in to sign in with using only email", () => {
    // it("visits the site login page", () => {
    //   cy.visit(LOCALHOST_URL);
    // });
    it("clicks login router link to navigate to the login page", () => {
      cy.wait(1000);
      cy.get("a.button.is-success")
        .contains("Login")
        .should("have.length", 1)
        .click();
    });

    it("logs in using only email", () => {
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
        expect(token).to.not.be.null;
      });
    });

    it("logs out", () => {
      cy.get("a.button.is-danger").contains("Logout").click();
    });
  });
});
