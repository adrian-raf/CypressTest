export default class Checkout {
  getTotal() {
    return cy.get('.summary_subtotal_label');
  }
}
