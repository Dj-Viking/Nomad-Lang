import { 
  LOCALHOST_URL, 
  ACTUALS_LOGINUNITSPEC_PATH_HEADLESS, 
  ACTUALS_LOGINUNITSPEC_PATH, 
  MOCK_USER
} from "../../constants";

beforeEach(() => cy.restoreLocalStorage());

afterEach(() => cy.saveLocalStorage());

describe("login-page-unit", () => {
  it("deletes any actuals for this test before we enter the page", () => {
    cy.deleteActuals({
      headedPath: ACTUALS_LOGINUNITSPEC_PATH,
      headlessPath: ACTUALS_LOGINUNITSPEC_PATH_HEADLESS
    });
  });

  it("visits the site login page", () => {
    cy.goToHomePage()
      .clickLoginButton();
  });
  it("screenshots-the-login-page", () => {
    cy.get("html").screenshot({ capture: "viewport" });
  });
});
  

describe("login-unit-test, tests login functionality", () => {
  it("visits the site login page", () => {
    
    cy.intercept("**/user/me", (req) => {
      req.reply({
        statusCode: 200
      });
    }).as("me");

    cy.visit(LOCALHOST_URL)
      .clickLoginButton();

  });
});

describe("tests login with incorrect credentials, has error message", () => {
  it("tries to login with incorrect credentials", () => {
    
    cy.intercept("**/user/login", (req) => {
      req.reply({
        statusCode: 400,
        status: 400,
        user: null,
        error: "Incorrect Credentials"
      });
    }).as("badLogin");

    cy.incorrectLogin();

  });
});

describe("tests the login with correct credentials works, has success message, and navigates back to home page", () => {
  describe("already logged in here signs in with only username", () => {

    it("logs in only with username", () => {
      cy.intercept("**/user/me", (req) => {
        req.reply({
          user: {
            ...MOCK_USER
          }
        });
      }).as("me");

      cy.intercept("**/user/login", (req) => {
        req.reply({
          user: {
            ...MOCK_USER
          }
        });
      }).as("usernameLogin");
  
      cy.loginWithOnlyUsername();
      
      cy.wait(3000);
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

  describe("logs back in to sign in with using only email", () => {
    
    it("logs in using only email", () => {

      cy.intercept("**/user/login", (req) => {
        req.reply({
          user: {
            ...MOCK_USER
          }
        });
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
    });
    
    it("logs out", () => {
      cy.logout();
    });
  });
});
