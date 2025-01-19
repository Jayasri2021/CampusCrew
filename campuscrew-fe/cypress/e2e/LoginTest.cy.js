describe('Login Test For Different Users', () => {
  beforeEach(() => {
    cy.visit('/login')
  })
  it('Login and check visibility for PFW user', () => {
    cy.contains(/Login/i).should('be.visible')
    cy.getDataTest('login-email').type('testuser01@pfw.edu')
    cy.getDataTest('login-password').type('testuser01')
    cy.contains(/Add New Service/i).should('not.exist')
    cy.getDataTest('login-button').click();
    cy.wait(1000)
    cy.contains(/Add New Service/i).should('exist')
    cy.get('[data-testid="LogoutIcon"]').click();
    cy.contains(/Add New Service/i).should('not.exist')
  })
  it('Login and check visibility for Non-PFW user', () => {
    cy.contains(/Login/i).should('be.visible');
    cy.getDataTest('login-email').type('testuser02@gmail.com')
    cy.getDataTest('login-password').type('testuser02')
    cy.contains(/Add New Service/i).should('not.exist')
    cy.getDataTest('login-button').click()
    cy.wait(1000)
    cy.contains(/Book Service/i).should('exist')
    cy.contains(/Add New Service/i).should('not.exist')
    cy.get('[data-testid="LogoutIcon"]').click()
    cy.contains(/Book Service/i).should('not.exist')
  })
  it('Login as Email is not registered', () => {
    cy.contains(/Login/i).should('be.visible');
    cy.getDataTest('login-email').type('testuser0111@gmail.com')
    cy.getDataTest('login-password').type('testuser02')
    cy.contains(/Add New Service/i).should('not.exist')
    cy.getDataTest('login-button').click()
    cy.wait(1000)
    cy.contains(/Email not registered/i).should('exist')
  })
  it('Login with wrong password', () => {
    cy.contains(/Login/i).should('be.visible');
    cy.getDataTest('login-email').type('testuser02@gmail.com')
    cy.getDataTest('login-password').type('wrong pass')
    cy.contains(/Add New Service/i).should('not.exist')
    cy.getDataTest('login-button').click()
    cy.wait(1000)
    cy.contains(/Wrong password/i).should('exist')
  })
})