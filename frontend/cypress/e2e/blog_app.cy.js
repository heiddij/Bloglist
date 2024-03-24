describe('Blog app', function () {
  beforeEach(function () {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    cy.createUser({
      name: 'Jaska Jokunen',
      username: 'joku',
      password: 'jaska'
    })
    cy.createUser({
      name: 'Minna Mainio',
      username: 'minna',
      password: 'moikku'
    })
  })

  it('Login form is shown', function () {
    cy.contains('login').click()
  })

  describe('Login', function () {
    it('succeeds with correct credentials', function () {
      cy.contains('login').click()
      cy.get('#username').type('joku')
      cy.get('#password').type('jaska')
      cy.get('#login-button').click()

      cy.wait(5000)

      cy.contains('Jaska Jokunen logged in')
    })

    it('fails with wrong credentials', function () {
      cy.contains('login').click()
      cy.get('#username').type('joku')
      cy.get('#password').type('wrong')
      cy.get('#login-button').click()

      cy.get('html').contains('Wrong username or password')
      cy.get('html').should('not.contain', 'Jaska Jokunen logged in')
    })
  })
})
