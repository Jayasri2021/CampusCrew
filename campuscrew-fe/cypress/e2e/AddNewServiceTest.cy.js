describe('Add New Service Test', () => {
  beforeEach(() => {
    cy.loginSuccessPFWuser()
  })
  it('Add New Service', () => {

    cy.contains('Add New Service').click();
    cy.getDataTest('add-service-name').type('Wedding Photography Service');
    cy.getDataTest('add-service-description').type('A comprehensive photography session for events.');
    cy.getDataTest('add-service-rate').type('100');
    cy.getDataTest('add-service-category').click();
    cy.contains('li', 'Photography').click();

    cy.getDataTest('add-service-image-urls').type('https://media.istockphoto.com/id/1196172395/photo/in-the-photo-studio-with-professional-equipment-portrait-of-the-famous-photographer-holding.jpg?s=612x612&w=0&k=20&c=utO4aHRyA5ZUAYxbk9NelmhR1_E5-AOWUWcqDMP-NXE=');

    cy.getDataTest('add-service-hours-0').clear().type('8');
    cy.getDataTest('add-service-minutes-0').clear().type('45');

    cy.get('#slot-date input').first().clear().type('01/15/2025 10:00 AM').blur(); 

     cy.getDataTest('submit-service-form').click();

    cy.get('.Toastify__toast--success').should('contain', 'Service created successfully!');
    cy.get('[data-testid="LogoutIcon"]').click();
  })
})