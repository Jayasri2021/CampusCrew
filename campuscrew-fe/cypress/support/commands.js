// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add('getDataTest', (dataTestSelector) => { 
    return cy.get(`[data-test="${dataTestSelector}"]`)
 })


 Cypress.Commands.add('loginSuccessPFWuser', () => {
    cy.visit('/login')
    cy.contains(/Login/i).should('be.visible')
    cy.getDataTest('login-email').type('testuser01@pfw.edu')
    cy.getDataTest('login-password').type('testuser01')
    cy.contains(/Book Services/i).should('not.exist')
    cy.getDataTest('login-button').click();
    cy.wait(1000)
    cy.contains(/Book Services/i).should('exist')
  })