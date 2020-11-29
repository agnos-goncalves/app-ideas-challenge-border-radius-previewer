describe('First Test', () => {
  beforeEach(() => {
    cy.visit('http://localhost:8080');
  });

  it('When insert invalid border radius should apply value 0', () => {
    cy.get('.box-radius-left-top').type('10');
    cy.get('.box-radius-right-bottom')
      .clear()
      .type('invalid')
      .trigger('change');

    cy.get('.box-radius').should(
      'have.css',
      'border-radius',
      '10px 10px 10px 0px'
    );
  });

  it('When adding the first input value should apply the same value to all input elements and show style border instruction', () => {
    cy.get('.box-radius-left-top').type('10').trigger('change');
    cy.get('.box-radius-content').contains(
      'border-radius: 10px 10px 10px 10px;'
    );
    cy.get('.box-radius-content-mobile').contains(
      'border-radius: 10px 10px 10px 10px;'
    );
  });

  it('When adding the more than one input value should apply value on input element and show style border instruction', () => {
    cy.get('.box-radius-left-top').type('10');
    cy.get('.box-radius-right-bottom').clear().type('20').trigger('change');
    cy.get('.box-radius').should(
      'have.css',
      'border-radius',
      '10px 10px 10px 20px'
    );
  });

  it('When click on checkbox browser support should change style border instruction now with preffix', () => {
    cy.get('.box-radius-left-top').type('10').trigger('change');
    cy.get('input[type=checkbox]').eq(1).click();
    cy.get('input[type=checkbox]').eq(2).click();
    const contentText =
      'border-radius: 10px 10px 10px 10px;-moz-border-radius: 10px 10px 10px 10px;-webkit-border-radius: 10px 10px 10px 10px;';

    cy.get('.box-radius-content').contains(contentText);
    cy.get('.box-radius-content-mobile').contains(contentText);
  });

  it('When remove checked on checkbox browser support should change style border instruction without preffix', () => {
    cy.get('.box-radius-left-top').type('10').trigger('change');
    cy.get('input[type=checkbox]').eq(1).click();
    const contentText =
      'border-radius: 10px 10px 10px 10px;-moz-border-radius: 10px 10px 10px 10px;';
    const contentTextRemoveCss3 = '-moz-border-radius: 10px 10px 10px 10px;';

    cy.get('.box-radius-content').contains(contentText);
    cy.get('.box-radius-content-mobile').contains(contentText);

    cy.get('input[type=checkbox]').eq(0).click();

    cy.get('.box-radius-content').contains(contentTextRemoveCss3);
    cy.get('.box-radius-content-mobile').contains(contentTextRemoveCss3);
  });
});
