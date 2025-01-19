describe('Registration Test For Different User Types', () => {
  beforeEach(() => {
    cy.visit('/signup'); 
  });

  it('Register a PFW user', () => {
    cy.getDataTest('signup-fname').type('John')
    cy.getDataTest('signup-lname').type('Doe')
    cy.getDataTest('signup-email').type('testuser15@pfw.edu')
    cy.getDataTest('signup-password').type('testuser15')
    cy.getDataTest('signup-isPfw').contains('Yes').click()
    cy.getDataTest('signup-button').click()
    cy.wait(1000)
    cy.url().should('include', '/dashboard')
    cy.contains(/Add New Service/i).should('exist')
    cy.get('[data-testid="LogoutIcon"]').click()
  });

  it('Register a non-PFW user', () => {
    cy.getDataTest('signup-fname').type('James')
    cy.getDataTest('signup-lname').type('Smith')
    cy.getDataTest('signup-email').type('testuser16@gmail.com')
    cy.getDataTest('signup-password').type('testuser16')
    cy.getDataTest('signup-isPfw').contains('No').click()
    cy.getDataTest('signup-button').click()
    cy.wait(1000)
    cy.url().should('include', '/dashboard')
    cy.contains(/Add New Service/i).should('not.exist')
    cy.get('[data-testid="LogoutIcon"]').click()
  });

  it('Displays error for existing user', () => {
    cy.getDataTest('signup-fname').type('Alice');
    cy.getDataTest('signup-lname').type('Smith');
    cy.getDataTest('signup-email').type('testuser15@pfw.edu');
    cy.getDataTest('signup-password').type('testuser15');
    cy.getDataTest('signup-isPfw').contains('Yes').click();
    cy.getDataTest('signup-button').click();
    cy.wait(1000);
    cy.contains(/User already exists/i).should('exist')
  });

  it('Validates PFW email for PFW students', () => {
    cy.getDataTest('signup-fname').type('Bob');
    cy.getDataTest('signup-lname').type('Johnson');
    cy.getDataTest('signup-email').type('bob@gmail.com'); 
    cy.getDataTest('signup-password').type('password123');
    cy.getDataTest('signup-isPfw').contains('Yes').click();
    cy.getDataTest('signup-button').click();
    cy.wait(1000);
    cy.get('.Toastify__toast-body').should('contain', 'Please use a valid PFW email');
  });
});
