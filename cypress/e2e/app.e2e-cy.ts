import { getSwapiMockResponse } from '../support/mock';
import { CLASSES, SELECTORS } from '../support/tag-helpers';

describe('App main page test case', () => {
  const API_URL = 'https://www.swapi.tech/api/**';

  beforeEach(() => {
    cy.visit('/');
  });

  it('Visits the initial app page and display info dialog', () => {
    const expectedHeaderTitleText = 'Star Wars Game';
    const expectedGameCardOverlayText = 'Game is not started';
    const expectedHeaderSubtitleText = 'May the Force be with you!';

    cy.get(SELECTORS.HEADER)
      .should('have.length', 1)
      .and('be.visible')
      .and('contain.text', expectedHeaderTitleText)
      .and('contain.text', expectedHeaderSubtitleText);

    cy.get(SELECTORS.APP_GAME_CARD)
      .should('have.length', 2)
      .and('be.visible')
      .and('contain.text', expectedGameCardOverlayText);

    cy.get(`button.${CLASSES.PLAY_GAME_BUTTON}`).should(
      'contain.text',
      'Play game'
    );

    cy.get(`button.${CLASSES.RULES_DIALOG_BUTTON}`)
      .should('be.visible')
      .click();

    cy.get(`.${CLASSES.MAT_DIALOG_CONTENT}`).should('be.visible');
    cy.get(`button.${CLASSES.CLOSE_RULE_DIALOG}`).should('be.visible').click();

    cy.get(`.${CLASSES.MAT_DIALOG_TITLE}`).should(
      'contain.text',
      'Rules of game'
    );
  });

  it('Play game till game request fails', () => {
    cy.intercept('GET', API_URL, {
      statusCode: 404,
    }).as('randomEntityRequest');

    const playGameButtonElement = cy
      .get(`button.${CLASSES.PLAY_GAME_BUTTON}`)
      .should('contain.text', 'Play game');

    playGameButtonElement.click();

    cy.wait('@randomEntityRequest');
    cy.get(`.${CLASSES.SNACK_BAR_LABEL}`)
      .should('be.visible')
      .should('contain.text', 'Random entity cannot be found');
  });

  it('Play game till success with "roll until success" flag turned on', () => {
    const expectedPlayButtonLabel = 'Play again';
    let requestNumber = 0;

    // mocking 2 rounds of 'sending' the request
    const mockSwapiResponses = [
      null,
      null,
      getSwapiMockResponse('people'),
      getSwapiMockResponse('starships'),
    ];
    cy.intercept('GET', API_URL, request => {
      if (!mockSwapiResponses[requestNumber]) {
        request.reply({ statusCode: 404 });
      } else {
        request.reply(mockSwapiResponses[requestNumber]!);
      }
      requestNumber++;
    }).as('randomEntityRequest');

    cy.get(SELECTORS.MAT_SLIDE_TOGGLE).click();

    cy.get(`button.${CLASSES.PLAY_GAME_BUTTON}`).click();

    cy.wait('@randomEntityRequest')
      .its('response.statusCode')
      .should('eq', 404);
    cy.wait('@randomEntityRequest')
      .its('response.statusCode')
      .should('eq', 404);

    cy.wait('@randomEntityRequest')
      .its('response.body.result.properties')
      .should('deep.equal', mockSwapiResponses[2]?.result?.properties);

    cy.wait('@randomEntityRequest')
      .its('response.body.result.properties')
      .should('deep.equal', mockSwapiResponses[3]?.result?.properties);

    cy.get(`button.${CLASSES.PLAY_GAME_BUTTON}`).should(
      'contain.text',
      expectedPlayButtonLabel
    );

    cy.get(SELECTORS.APP_GAME_CARD).should('have.length', 2);
    const firstGameCard = cy.get(SELECTORS.APP_GAME_CARD).eq(0);
    const secondGameCard = cy.get(SELECTORS.APP_GAME_CARD).eq(1);

    secondGameCard
      .get(`p.${CLASSES.WON_COUNT}`)
      .should('contain.text', '🏆: 1');

    secondGameCard
      .get(`.${CLASSES.WON_ICON}`)
      .should('be.visible')
      .and('have.class', 'text-teal-500');
    secondGameCard
      .get(`p.${CLASSES.LOST_COUNT}`)
      .should('contain.text', '👎: 0');
    secondGameCard
      .get(`p.${CLASSES.TIED_COUNT}`)
      .should('contain.text', '🏳: 0');

    firstGameCard.get(`p.${CLASSES.WON_COUNT}`).should('contain.text', '🏆: 0');
    firstGameCard
      .get(`p.${CLASSES.LOST_COUNT}`)
      .should('contain.text', '👎: 1');
    firstGameCard
      .get(`.${CLASSES.LOST_ICON}`)
      .should('be.visible')
      .and('have.class', 'text-rose-500');
    firstGameCard.get(`p.${CLASSES.TIED_COUNT}`).should('contain.text', '🏳: 0');
  });

  it('Play game with selected "people" type', () => {
    cy.get(`.${CLASSES.PLAY_AGAINST_FORM_INPUT}`).should('be.visible').click();

    // index 1 is responsible for people type
    cy.get(`.${CLASSES.MAT_OPTION}`).should('have.length', 3).eq(1).click();

    cy.intercept('GET', API_URL, request => {
      request.reply(getSwapiMockResponse('people'));
    }).as('randomEntityRequest');

    const playGameButtonElement = cy
      .get(`button.${CLASSES.PLAY_GAME_BUTTON}`)
      .should('contain.text', 'Play game');

    playGameButtonElement.click();

    cy.wait('@randomEntityRequest');

    const secondGameCard = cy
      .get(SELECTORS.APP_GAME_CARD)
      .should('have.length', 2)
      .eq(1);

    secondGameCard
      .get(`.${CLASSES.MAT_CARD_SUBTITLE}`)
      .should('contain.text', 'Kind: people');

    // presumably it's the same card on both sides, so result will be 'tied'
    secondGameCard
      .get(`p.${CLASSES.WON_COUNT}`)
      .should('contain.text', '🏆: 0');
    secondGameCard
      .get(`p.${CLASSES.LOST_COUNT}`)
      .should('contain.text', '👎: 0');
    secondGameCard
      .get(`p.${CLASSES.TIED_COUNT}`)
      .should('contain.text', '🏳: 1');
  });
});
