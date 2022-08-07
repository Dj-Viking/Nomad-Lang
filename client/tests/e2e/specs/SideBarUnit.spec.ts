import {
  ACTUALS_SIDEBARUNITSPEC_PATH,
  ACTUALS_SIDEBARUNITSPEC_PATH_HEADLESS,
} from "../../constants";


beforeEach(() => cy.restoreLocalStorage());

afterEach(() => cy.saveLocalStorage());

describe("sidebar-screenshot", () => {
  it("deletes any actuals for this test before we enter the page", () => {
    cy.deleteActuals({
      headedPath: ACTUALS_SIDEBARUNITSPEC_PATH,
      headlessPath: ACTUALS_SIDEBARUNITSPEC_PATH_HEADLESS
    });
  });
  
  it("visit's home page", () => {
    cy.goToHomePage();
  });
  
  it("opens the sidebar clicking the chevron arrow", () => {
    cy.get("i.fa.fa-chevron-right").click();
    cy.wait(1200);
    cy.get("i.fa.fa-chevron-left").should("have.length", 1);
  });

  it("screenshots-the-entire-page", () => {
    cy.get("div.side-bar").screenshot({ capture: "runner" });
  });
  
  it("closes the sidebar clicking the chevron arrow", () => {
    cy.get("i.fa.fa-chevron-left").click();
    cy.wait(1200);
    cy.get("i.fa.fa-chevron-right").should("have.length", 1);
  });
});

describe("tests sidebar opening with c key", () => {
  it("opens sidebar with the c key pressed on the document object", () => {
    cy.get("body").type("c");
    cy.wait(1200);
    cy.get("i.fa.fa-chevron-left").should("have.length", 1);
  });
  it("theme toggle button should be set light theme initially", () => {
    cy.get("button.my-toggle-light").should("have.length", 1);
    cy.get("i.fa.fa-sun-o").should("have.length", 1);
  });
  it("clicking theme toggle button should set theme to dark", () => {
    cy.get("button.my-toggle-light").click();
    cy.wait(500);
    cy.get("body.body-dark").should("have.length", 1);
  });
});


// TODO: login and add cards with actual real language categories

// test that the search will allow the single card that matches the
// search text input to appear alone

// clear the cards on the user after the test is over