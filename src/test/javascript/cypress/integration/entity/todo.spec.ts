import { entityItemSelector } from '../../support/commands';
import {
  entityTableSelector,
  entityDetailsButtonSelector,
  entityDetailsBackButtonSelector,
  entityCreateButtonSelector,
  entityCreateSaveButtonSelector,
  entityCreateCancelButtonSelector,
  entityEditButtonSelector,
  entityDeleteButtonSelector,
  entityConfirmDeleteButtonSelector,
} from '../../support/entity';

describe('Todo e2e test', () => {
  const todoPageUrl = '/todo';
  const todoPageUrlPattern = new RegExp('/todo(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'admin';
  const password = Cypress.env('E2E_PASSWORD') ?? 'admin';
  const todoSample = { title: 'Small Gorgeous lavender', createdAt: '2021-10-21T16:04:19.733Z' };

  let todo: any;

  before(() => {
    cy.window().then(win => {
      win.sessionStorage.clear();
    });
    cy.visit('');
    cy.login(username, password);
    cy.get(entityItemSelector).should('exist');
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/todos+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/todos').as('postEntityRequest');
    cy.intercept('DELETE', '/api/todos/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (todo) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/todos/${todo.id}`,
      }).then(() => {
        todo = undefined;
      });
    }
  });

  it('Todos menu should load Todos page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('todo');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response!.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('Todo').should('exist');
    cy.url().should('match', todoPageUrlPattern);
  });

  describe('Todo page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(todoPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create Todo page', () => {
        cy.get(entityCreateButtonSelector).click({ force: true });
        cy.url().should('match', new RegExp('/todo/new$'));
        cy.getEntityCreateUpdateHeading('Todo');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click({ force: true });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', todoPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/todos',
          body: todoSample,
        }).then(({ body }) => {
          todo = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/todos+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [todo],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(todoPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details Todo page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('todo');
        cy.get(entityDetailsBackButtonSelector).click({ force: true });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', todoPageUrlPattern);
      });

      it('edit button click should load edit Todo page', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Todo');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click({ force: true });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', todoPageUrlPattern);
      });

      it('last delete button click should delete instance of Todo', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('todo').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click({ force: true });
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', todoPageUrlPattern);

        todo = undefined;
      });
    });
  });

  describe('new Todo page', () => {
    beforeEach(() => {
      cy.visit(`${todoPageUrl}`);
      cy.get(entityCreateButtonSelector).click({ force: true });
      cy.getEntityCreateUpdateHeading('Todo');
    });

    it('should create an instance of Todo', () => {
      cy.get(`[data-cy="title"]`).type('redundant').should('have.value', 'redundant');

      cy.get(`[data-cy="description"]`).type('seamless extranet Account').should('have.value', 'seamless extranet Account');

      cy.get(`[data-cy="createdAt"]`).type('2021-10-21T16:18').should('have.value', '2021-10-21T16:18');

      cy.get(`[data-cy="deadline"]`).type('2021-10-22T13:08').should('have.value', '2021-10-22T13:08');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response!.statusCode).to.equal(201);
        todo = response!.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response!.statusCode).to.equal(200);
      });
      cy.url().should('match', todoPageUrlPattern);
    });
  });
});
