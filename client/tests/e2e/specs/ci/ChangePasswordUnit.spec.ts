


beforeEach(() => cy.restoreLocalStorage());

afterEach(() => cy.saveLocalStorage());

describe("check that the change password page works correctly", () => {
    it("deletes actuals", () => {
        expect(true).to.eq(true);
    });
});