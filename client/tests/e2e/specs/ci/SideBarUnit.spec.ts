import { AddCardResponse, ChangeThemePrefResponse, LoginResponse } from "@/types";
import { IMeResponse } from "../../../../../server/src/types";
import { EXPECTED_ADD_LOCAL_CARD_OBJECT, MOCK_USER_WITH_CARDS } from "../../../constants";


beforeEach(() => cy.restoreLocalStorage());

afterEach(() => cy.saveLocalStorage());

describe("sidebar-screenshot", () => {
  // it("deletes any actuals for this test before we enter the page", () => {
  //   cy.deleteActuals({
  //     headedPath: ACTUALS_SIDEBARUNITSPEC_PATH,
  //     headlessPath: ACTUALS_SIDEBARUNITSPEC_PATH_HEADLESS
  //   });
  // });
  
  it("visit's home page", () => {
    cy.goToHomePage()
      .openSideBar();
  });
  // it("screenshots-the-entire-page", () => {
  //   cy.get("div.side-bar").screenshot({ capture: "runner" });
  // });
  
  it("closes the sidebar clicking the chevron arrow", () => {
    cy.closeSideBar()
      .get("i.fa.fa-chevron-right").should("have.length", 1);
  });
});

describe("tests sidebar opening with c key", () => {
  it("opens sidebar with the c key pressed on the document object", () => {
    cy.pressCToOpenSideBar();
    cy.get("i.fa.fa-chevron-left").should("have.length", 1);
  });
  it("theme toggle button should be set light theme initially", () => {
    cy.get("button.my-toggle-light").should("have.length", 1);
    cy.get("i.fa.fa-sun-o").should("have.length", 1);
  });
  it("clicking theme toggle button should set theme to dark and then light again", () => {
    cy.toggleThemeToDark();
    cy.wait(500);
    cy.get("body.body-dark").should("have.length", 1);
    cy.toggleThemeToLight();
    cy.closeSideBar();
  });
});


// TODO: login and add cards with actual real language categories
describe("log in and start messing with cards", () => {
  it("logs in", () => {
    
    cy.intercept("**/user/me", (req) => {
      req.reply({
        statusCode: 200,
        body: { 
          user: {
          ...MOCK_USER_WITH_CARDS
          } 
        }
      } as { statusCode: number; body: IMeResponse; });
    }).as("me");
    
    cy.intercept("**/user/login", (req) => {
      req.reply({
        statusCode: 200,
        body: {
          user: {
            ...MOCK_USER_WITH_CARDS,
          }
        }
      } as { statusCode: number, body: LoginResponse });
    }).as("login");

    cy.intercept("**/user/addCard", (req) => {
      req.reply({
        statusCode: 200,
        body: {
          cards: [...MOCK_USER_WITH_CARDS.cards]
        }
      } as { statusCode: number; body: AddCardResponse });
    }).as("addCard");

    cy.intercept("**/user/changeThemePref", (req) => {
      req.reply({
        statusCode: 200,
        body: {
          themePref: "dark"
        }
      } as { statusCode: number; body: ChangeThemePrefResponse });
    }).as("themePrefChange"); 

    cy.clickLoginButton()
      .loginWithOnlyEmail();
    cy.wait(2000);
    cy.addCard();

    cy.openSideBar();
    cy.clickToActivateCategory(EXPECTED_ADD_LOCAL_CARD_OBJECT.frontSideLanguage as string)
      .wait(500).hitOneKeyToDeactivateCategory(EXPECTED_ADD_LOCAL_CARD_OBJECT.frontSideLanguage as string);

    cy.toggleThemeToDark().toggleThemeToLight();

  });
  it("errors the themepref change", () => {
    cy.intercept("**/user/changeThemePref", (req) => {
      req.reply({
        statusCode: 400,
      });
    });
    cy.toggleThemeToDark();
  });
});