/// <reference types="cypress" />;

import Login from './Pages/LoginPage';
import Checkout from './Pages/CheckoutPage';

describe('Checkout Item end to end', () => {
  before(() => {
    cy.fixture('example').then(function (data) {
      this.data = data;
    });
  });

  it('Checkout all items', function () {
    const login = new Login();
    const checkout = new Checkout();

    cy.visit(Cypress.env('baseURL'));

    login.getUsername().type(this.data.username);
    login.getPassword().type(this.data.password);
    login.getButton().click();
    cy.url().should('eq', Cypress.env('baseURL') + '/inventory.html');
    cy.get('.inventory_item_img').should('be.visible');
    cy.get('.inventory_item').should('have.length', 6);

    this.data.productName.forEach(function (element) {
      cy.selectProduct(element);
    });
    cy.get('.shopping_cart_link').click();
    cy.url().should('eq', Cypress.env('baseURL') + '/cart.html');
    cy.get('.cart_list').should('be.visible');

    cy.get('#checkout').click();

    cy.get('#first-name').type('Adrian');
    cy.get('#last-name').type('Rafly');
    cy.get('#postal-code').type('12345');
    cy.get('#continue').click();

    // cek total harga saat checkout
    let sum = 0;
    let hasil;

    cy.get('.inventory_item_price')
      .each(($el, index, $list) => {
        let res = $el.text().match(/\d+\.\d+/);
        sum = Number(sum) + Number(res);
      })
      .then(function () {
        cy.log(sum);
      });

    checkout.getTotal().each(function (el) {
      hasil = el.text().match(/\d+\.\d+/);
      expect(Number(hasil)).to.equal(sum);
    });

    // match(/\d+\.\d+/);
    cy.get('#finish').click();
    cy.get('.title').should('have.text', 'Checkout: Complete!');

    // untuk memilih hanya produk tertentu saja
    // cy.selectProduct(this.data.productName[2]);
    // cy.get('.shopping_cart_link').click();
  });
});
