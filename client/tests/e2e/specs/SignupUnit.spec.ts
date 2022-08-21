import { RegisterResponse } from "@/types";
import { ILoginResponse, IMeResponse } from "../../../../server/src/types";
import {
  ACTUALS_SIGNUPUNITSPEC_PATH,
  ACTUALS_SIGNUPUNITSPEC_PATH_HEADLESS,
  MOCK_USER,
} from "../../constants";

beforeEach(() => cy.restoreLocalStorage());

afterEach(() => cy.saveLocalStorage());

describe("deletes-screenshots", () => {
  it("deletes any actuals for this test before we enter the page", () => {
    cy.deleteActuals({
      headedPath: ACTUALS_SIGNUPUNITSPEC_PATH,
      headlessPath: ACTUALS_SIGNUPUNITSPEC_PATH_HEADLESS
    });
  });
  it("visits the home page and then signup page", () => {
    cy.intercept("**/user/me", (req) => {
      req.reply({
        user: {
          ...MOCK_USER,
        }
      } as IMeResponse);
    }).as("me");
    cy.goToHomePage()
      .clickSignupButton();
  });
  it("screenshots-the-entire-page", () => {
    cy.get("html").screenshot({ capture: "runner" });
  });
});

describe("tests signup with invalid email, has error message", () => {
  it("tries to signup with invalid email", () => {
    
    cy.intercept("**/user/signup", (req) => {
      req.reply({
        error: "invalid email",
        user: null
      } as RegisterResponse);
    }).as("signup");

    cy.invalidEmailSignup();

  });
});
describe("tries to make account with too short password", () => {
  //Error: password length too short must be greater than 3 characters
  it("user tries to sign up with too short password", () => {

    cy.intercept("**/user/signup", (req) => {
      req.reply({
        error: "password length too short must be greater than 3 characters",
        user: null
      } as RegisterResponse);
    }).as("signup");

    cy.tooShortPasswordSignup();

  });

});

describe("checks the user or email error appears", () => {
  it("user tries to sign up with already used email", () => {

    cy.intercept("**/user/signup", (req) => {
      req.reply({
        error: "That email is already in use.",
        user: null
      } as RegisterResponse);
    }).as("signup");

    cy.alreadyUsedEmailSignup();
  });
});

describe("tests the register with valid inputs works, has success message, and navigates back to home page", () => {
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
          cards: []
        }
      } as IMeResponse);
    }).as("me");
    
    cy.signupWhileOnSignupPage();
    //not sure why the assertion only works here but okay
    // cypress trashes local storage during the test to prevent buildup of state or something like that
    let token: string | null = "";
    cy.restoreLocalStorage();
    cy.window().then((window) => {
      token = window.localStorage.getItem("id_token");
      expect(token).to.not.be.null;
      cy.saveLocalStorage();
    });
  });
});

describe("should be able to login with those credentials that we just registered with", () => {

  it("goes to login page to sign in as the user we just signed up as", () => {
    cy.intercept("**/user/login", (req) => {
      req.reply({
        ...MOCK_USER
      } as ILoginResponse);
    }).as("login");

    cy.intercept("**/user/me", (req) => {
      req.reply({
        user: {
          ...MOCK_USER,
          cards: []
        }
      } as IMeResponse);
    }).as("me");

    cy.loginNew();

    //not sure why the assertion only works here but okay
    // cypress trashes local storage during the test to prevent buildup of state or something like that
    cy.window().then((window) => {
      const token = window.localStorage.getItem("id_token");
      expect(token).to.not.be.null;
    });
    
    cy.logout();
  });
});
