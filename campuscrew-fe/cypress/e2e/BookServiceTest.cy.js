describe('Book Service Test', () => {
    beforeEach(() => {
      cy.loginSuccessPFWuser()
    })
    it('Book Service', () => {
  
      cy.getDataTest('book-service-button').first().click();
      cy.getDataTest('book-service-slot-select').first().click();
      cy.getDataTest('book-service-confirm-button').click();
      cy.get('.Toastify__toast--success').should('contain', 'Booking successful!');
      cy.getDataTest('book-service-confirm-close-button').click();
      cy.get('[data-testid="LogoutIcon"]').click();
    })
  })