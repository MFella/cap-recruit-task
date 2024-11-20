import { getSwapiMockResponse } from '../support/mock';
import { CLASSES, SELECTORS } from '../support/tag-helpers';

describe('App home screen test case', () => {
  it('Visits the initial project page', () => {
    cy.visit('/');
    const mainHeaderElement = cy.get(SELECTORS.HEADER);
    const gameCardElements = cy.get(SELECTORS.APP_GAME_CARD);

    mainHeaderElement
      .should('have.length', 1)
      .and('be.visible')
      .and('contain.text', 'Star Wars Game');

    gameCardElements
      .should('have.length', 2)
      .and('be.visible')
      .and('contain.text', 'Game is not started');
  });

  it('Play game till game failure', () => {
    cy.visit('/');

    const playGameButtonElement = cy.get(`button.${CLASSES.PLAY_GAME_BUTTON}`);

    cy.intercept('GET', 'https://www.swapi.tech/api/*', {
      statusCode: 200,
      body: getSwapiMockResponse('people'),
    }).as('firstRandomRequest');

    cy.intercept('GET', 'https://www.swapi.tech/api/*', {
      statusCode: 200,
      body: getSwapiMockResponse('starships'),
    }).as('secondRandomRequest');

    playGameButtonElement.should('have.text', 'Play game').click();

    cy.wait('@firstRandomRequest');
    cy.wait('@secondRandomRequest');
  });
});
