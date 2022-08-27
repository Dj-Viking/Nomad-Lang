import { ChangePasswordResponse } from "@/types";
import { EXPECTED_ADD_LOCAL_CARD_OBJECT, MOCK_USER } from "tests/constants";
import { IMeResponse } from "../../../../../server/src/types";

beforeEach(() => cy.restoreLocalStorage());

afterEach(() => cy.saveLocalStorage());

describe("check that the change password page works correctly", () => {
    it("visit the change password page", () => {
        cy.navigatePage(`/changepass/askdfjdkj`);
    });

    it("checks the proper elements exists", () => {
        cy.get("form.field.box").should("have.length", 1);
        cy.get("label.label").should("have.length", 2).then((collection) => {
            expect(collection.eq(0).text()).to.eq("New Password");
            expect(collection.eq(1).text()).to.eq("Confirm New Password");
        });
        cy.getNavHomeButton();
        cy.getChangePasswordSubmitButton();
    });

    it("checks when typing the progress bar appears and disappears when typing", () => {
        cy.get("input[name=passwordInput]").should("have.length", 1).type("a really big password weeeeeeeeeeeeeeeeeeeeeeeeeeee");
        cy.get("progress").should("have.length", 1);
        cy.get("progress").should("have.length", 1).should("have.class", "is-success");
        cy.clearChangePasswordInput();
        cy.get("progress").should("have.length", 0);
    });
    
    it("tries to send a password that doesn't match the new input and the confirm input", () => {
        cy.getChangePasswordInput().type("a really big password weeeeeeeeeeeeeeeeeeeeeeeeeeee");
        cy.getChangePasswordConfirmInput().type("a really big password weeeeeeeeeeeeeeeeeedsfgsdfgeeeeeeeeee");
        cy.wait(1);
        cy.getChangePasswordSubmitButton().click();
        cy.getErrorToast()
            .getToastBody().contains("Entered password and confirmed password do not match.")
            .clearChangePasswordInput()
            .clearChangePasswordConfirmInput();
    });

    it("tries to send a password that does match both input fields and then is navigated to home page as logged in", () => {
        cy.intercept("PUT", "**/changePassword", (req) => {
            const res: ChangePasswordResponse = {
                done: true,
                token: "kdjfkdjfjkd",
                cards: [...MOCK_USER.cards],
                error: ""
            };

            req.reply(res);
        }).as("changePass");
        cy.intercept("**/user/me", (req) => {
            req.reply({
              user: {
                ...MOCK_USER,
                cards: [...MOCK_USER.cards, EXPECTED_ADD_LOCAL_CARD_OBJECT]
              }
            } as IMeResponse);
          }).as("me");
        cy.getChangePasswordInput().type("something")
            .getChangePasswordConfirmInput().type("something")
            .getChangePasswordSubmitButton().click()
            .getSuccessToast()
            .getToastBody().contains("Successfully changed password, good luck and have fun!");

        cy.wait(2000);
        cy.getLogoutButton();

    }); 
});