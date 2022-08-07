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
    }
}