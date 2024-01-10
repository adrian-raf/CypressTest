/// <reference types="cypress" />;
import Login from '../Pages/LoginPage';
import Checkout from '../Pages/CheckoutPage';
import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';
import * as data from '../../fixtures/example.json';

const login = new Login();
const checkout = new Checkout();
const allData = data;

Given('I open sauce demo page', () => {
  cy.visit(Cypress.env('baseURL'));
});

When('I success Login with validate username & password', () => {
  login.getUsername().type(allData.username);
  login.getPassword().type(allData.password);
  login.getButton().click();
  cy.url().should('eq', Cypress.env('baseURL') + '/inventory.html');
  cy.get('.inventory_item_img').should('be.visible');
  cy.get('.inventory_item').should('have.length', 6);
});

Then('Add 6 item to cart', () => {
  allData.productName.forEach(function (element) {
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
});

Then('Check total price and complete the transaction', () => {
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

  cy.get('#finish').click();
  cy.get('.title').should('have.text', 'Checkout: Complete!');
});
