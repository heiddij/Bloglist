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

    describe('When logged in', function () {
      beforeEach(function () {
        cy.login({ username: 'joku', password: 'jaska' })
      })

      it('A blog can be created', function () {
        cy.contains('new blog').click()
        cy.get('#title').type('Hellouuuuu')
        cy.get('#author').type('Joku Vaan')
        cy.get('#url').type('hei.fi')
        cy.get('#submit-button').click()
        cy.contains('Hellouuuuu')
      })

      describe('A blog exsists', function () {
        beforeEach(function () {
          cy.createBlog({
            title: 'Taas testaillaan',
            author: 'Minahan Se',
            url: 'kivaa.fi',
            likes: 3
          })
        })

        it('Blog can be liked', function () {
          cy.contains('view').click()
          cy.contains('like').click()
          cy.contains('likes 4')
        })

        it('Blog can be removed by the user who has added the blog', function () {
          cy.contains('view').click()
          cy.contains('remove').click()
          cy.get('html').should('not.contain', 'Taas testaillaan')
        })

        it('Remove button is shown only if the user has added the blog', function () {
          cy.contains('logout').click()
          cy.login({ username: 'minna', password: 'moikku' })
          cy.contains('Taas testaillaan')
          cy.contains('view').click()

          cy.contains('Taas testaillaan').should('not.contain', 'remove')
        })
      })
    })
  })
})
