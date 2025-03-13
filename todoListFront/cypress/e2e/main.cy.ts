// https://on.cypress.io/api

describe('App mounted', () => {
  it('Has a title and add button', () => {
    cy.visit('/')
    cy.contains('h1', 'My todo list')
    cy.get('[data-testid="add-task-button"]')
  })
  it('Open create task form', () => {
    cy.visit('/')
    cy.get('[data-testid="add-task-button"]').click()
    cy.contains('Create task')
  })
})
