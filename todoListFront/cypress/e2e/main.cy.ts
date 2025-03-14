// https://on.cypress.io/api
import { BASE_TASK_URL } from '../../src/utils/constants'
import taskResponse from '../fixtures/tasks.json'

describe('App mounted', () => {
  let callCount = 0

  beforeEach(() => {
    callCount = 0
    cy.intercept('GET', BASE_TASK_URL, { fixture: 'tasks.json' }).as('getTasks')
  })

  it('Has a title and add button', () => {
    cy.visit('/')
    cy.contains('h1', 'My todo list')
    cy.get('[data-testid="add-task-button"]')
  })

  it('Click on create a new task but cancel it', () => {
    cy.visit('/')
    cy.get('[data-testid="add-task-button"]').click()
    cy.contains('Create task').should('be.visible')
    cy.get('[data-testid="task-title"]').type('Wash my car', {
      force: true,
    })
    cy.get('[data-testid="task-description"]').type('Wash my car with soap and water', {
      force: true,
    })
    cy.get('[data-testid="cancel-button"]').click()
    cy.contains('Create task').should('not.exist')
  })

  it('Click on create a new task and create it', () => {
    cy.intercept('GET', BASE_TASK_URL, (req) => {
      if (callCount === 0) {
        req.reply({ statusCode: 200, body: [...taskResponse] })
      } else {
        req.reply({
          statusCode: 200,
          body: [
            {
              id: '2156251752',
              title: 'Wash my car',
              description: 'Wash my car with soap and water',
              status: 'todo',
            },
            ...taskResponse,
          ],
        })
      }
      callCount++
    }).as('getTasks')

    cy.intercept('POST', BASE_TASK_URL, {
      body: {
        acknowledged: true,
        insertedId: '67d428559c64683af75e609c',
      },
    })

    cy.visit('/')
    cy.get('[data-testid="task"]').should('have.length', 6)

    cy.get('[data-testid="add-task-button"]').click()
    cy.contains('Create task').should('be.visible')
    cy.get('[data-testid="task-title"]').type('Wash my car', {
      force: true,
    })
    cy.get('[data-testid="task-description"]').type('Wash my car with soap and water', {
      force: true,
    })
    cy.get('[data-testid="save-button"]').click()
    cy.contains('Create task').should('not.exist')
    cy.contains('Wash my car').should('be.visible')
    cy.contains('Confirmed').should('be.visible')
    cy.get('[data-testid="task"]').should('have.length', 7)
  })

  it('Delete task', () => {
    cy.intercept('GET', BASE_TASK_URL, (req) => {
      if (callCount === 0) {
        req.reply({
          statusCode: 200,
          body: [
            {
              id: '2156251752',
              title: 'Wash my car',
              description: 'Wash my car with soap and water',
              status: 'todo',
            },
            ...taskResponse,
          ],
        })
      } else {
        req.reply({
          statusCode: 200,
          body: [...taskResponse],
        })
      }
      callCount++
    })

    cy.intercept('DELETE', BASE_TASK_URL + '2156251752', {
      body: {
        acknowledged: true,
        deletedId: '67d428559c64683af75e609c',
      },
    })

    cy.visit('/')
    cy.get('[data-testid="task"]').should('have.length', 7)

    cy.get('[data-testid="task"]').first().click()
    cy.get('[data-testid="delete-task-button"]').first().click()
    cy.contains('Delete task').should('be.visible')
    cy.contains('button', 'Delete').click()
    cy.contains('Delete task').should('not.exist')
    cy.contains('Confirmed').should('be.visible')
    cy.contains('Wash my car').should('not.exist')
    cy.get('[data-testid="task"]').should('have.length', 6)
  })
})
