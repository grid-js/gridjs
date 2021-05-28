/// <reference types="cypress" />

context('Table', () => {
  beforeEach(() => {
    cy.visit('http://localhost:8080')
  })

  it('should render a table', () => {
    cy.get('table').should('have.length', 1);
  })
})
