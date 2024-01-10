class Login {
  getUsername() {
    return cy.get('#user-name');
  }

  getPassword() {
    return cy.get('#password');
  }

  getButton() {
    return cy.get('#login-button');
  }
}

export default Login;
