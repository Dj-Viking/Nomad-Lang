import { ForgotPassResponse } from "@/types";
import { MOCK_USER } from "tests/constants";
import { IMeResponse } from "../../../../server/src/types";

beforeEach(() => cy.restoreLocalStorage());

afterEach(() => cy.saveLocalStorage());

describe("check that the forgot password page works correctly", () => {

    it("goes to forgot password page and checks all elements are present", () => {

        cy.intercept("**/user/me", (req) => {
            req.reply({
                user: {
                    ...MOCK_USER
                }            
            } as IMeResponse);
        }).as("me");

        cy.navigatePage("/forgot");
        cy.get("label.label").should("have.length", 1).contains("Enter an email to send the reset link to");
        cy.getNavHomeButton();
        cy.getForgotPasswordSubmitButton();
        cy.getForgotPasswordEmailInput().then((collection) => {
            expect(collection[0].placeholder).to.eq("your@email.com");
        });
    });

    it("types in an email and gets bad response", () => {
        cy.intercept("**/user/forgotPassword", (req) => {
            const res = {
                statusCode: 500,
                body: {
                    done: true,
                    error: "[ERROR]: UNEXPECTED STATUS 500"
                }
            } as { statusCode: number; body: ForgotPassResponse };

            req.reply(res);
        }).as("forgot");

        cy.getForgotPasswordEmailInput().type("something");
        cy.getForgotPasswordSubmitButton().click();
        cy.getErrorToast()
            .getToastBody().should("have.text", "Error happened during forgot password request [ERROR]: UNEXPECTED STATUS 500")
            .getForgotPasswordEmailInput().clear()
            .getErrorToast().click().wait(500);
    });

    it("types in an email and gets good response", () => {
        cy.intercept("**/user/forgotPassword", (req) => {
            const res = {
                statusCode: 200,
                body: {
                    done: true,
                    error: ""
                }
            } as { statusCode: number; body: ForgotPassResponse };

            req.reply(res);
        }).as("forgot");

        cy.getForgotPasswordEmailInput().type("something");
        cy.getForgotPasswordSubmitButton().click();
        cy.getSuccessToast()
            .getToastBody().should("have.text", "If there is an account with that email, a password reset request email is being sent now!")
            .getForgotPasswordEmailInput().clear()
            .getSuccessToast().click().wait(2000);
    });

});