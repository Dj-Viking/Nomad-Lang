/* eslint-disable */
// in cypress/support/index.ts
// load type definitions that come with Cypress module
/// <reference types="cypress" />


declare namespace Cypress {
 
    interface DeleteActualsArgs {
        headlessPath: string;
        headedPath: string;
    }
    interface Chainable<Subject = any> {
        /**
        * Custom command to select DOM element by data-cy attribute.
        * @example cy.dataCy('greeting')
        */
        dataCy(value: string): Chainable<Subject>;
        /**
         * delete the actuals screenshots when running any test to refresh the folder with new screenshots
         * @param args : headlessPath, headedPath - input paths for deleting actuals screenshots in those directories;
         */
        deleteActuals(args: DeleteActualsArgs): Chainable<Subject>;
        /**
         * 
         * @param suffix : path to navigate client side ;
         * @example 
         * cy.navigatePage("/login");
         */
        navigatePage(suffix: string): Chainable<Subject>;
        
        goToHomePage(): Chainable<Subject>;
        
        restoreLocalStorage(): Chainable<Subject>;

        saveLocalStorage(): Chainable<Subject>;

        addCard(): Chainable<Subject>;

        editCard(): Chainable<Subject>;

        deleteCard(): Chainable<Subject>;

        clearCards(): Chainable<Subject>;

        signup(): Chainable<Subject>;
        
        signupWhileOnSignupPage(): Chainable<Subject>;
 
        loginWithOnlyUsername(): Chainable<Subject>;
        
        loginWithOnlyEmail(): Chainable<Subject>;
        
        logout(): Chainable<Subject>;
        
        loginNew(): Chainable<Subject>;
        
        incorrectLogin(): Chainable<Subject>;

        clickSignupButton(): Chainable<Subject>;
        
        clickLoginButton(): Chainable<Subject>;

        invalidEmailSignup(): Chainable<Subject>;
 
        tooShortPasswordSignup(): Chainable<Subject>;
        
        alreadyUsedEmailSignup(): Chainable<Subject>;

        openSideBar(): Chainable<Subject>;

        getChangePasswordSubmitButton(): Chainable<Subject>;
        
        getForgotPasswordSubmitButton(): Chainable<Subject>;
        
        getNavHomeButton(): Chainable<Subject>;
        
        getLogoutButton(): Chainable<Subject>;
        
        getChangePasswordInput(): Chainable<Subject>;

        clearChangePasswordInput(): Chainable<Subject>;
        
        getForgotPasswordEmailInput(): Chainable<JQuery<HTMLInputElement>>;
        
        getChangePasswordConfirmInput(): Chainable<Subject>;
        
        clearChangePasswordConfirmInput(): Chainable<Subject>;
        
        getErrorToast(): Chainable<Subject>;
        
        getSuccessToast(): Chainable<Subject>;
        
        getToastBody(): Chainable<Subject>;
    }
}