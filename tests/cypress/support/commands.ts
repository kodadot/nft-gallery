/// <reference types="cypress" />
/* eslint-disable @typescript-eslint/no-namespace */
import 'cypress-file-upload'
import 'cypress-network-idle'
import 'cypress-real-events/support'
import consola from 'consola'

export {}

Cypress.on('uncaught:exception', (err) => {
  consola.error(err)
  return false
})

Cypress.Commands.add('getCy', (selector, ...args) => {
  return cy.get(`[data-cy=${selector}]`, ...args)
})

Cypress.Commands.add('loginWithKeyring', () => {
  cy.visit('/')
  cy.visit('/e2e-login')
  cy.waitForNetworkIdle('POST', '*', 1000)
})

Cypress.Commands.add('rmrkNavbar', () => {
  cy.get('[data-cy="classic"]')
    .should('have.attr', 'href')
    .and('include', '/rmrk/create')
  cy.get('[data-cy="simple"]')
    .should('have.attr', 'href')
    .and('include', '/rmrk/mint')
  cy.get('[data-cy="explore"]').should('be.visible')
  cy.get('[data-cy="stats"]').should('be.visible')
  cy.get('[data-cy="spotlight"]')
    .should('have.attr', 'href')
    .and('include', '/spotlight')
  cy.get('[data-cy="series-insight"]')
    .should('have.attr', 'href')
    .and('include', '/series-insight')
  cy.get('[data-cy="sales"]')
    .should('have.attr', 'href')
    .and('include', '/sales')
  cy.get('[data-cy="hot"]').should('have.attr', 'href').and('include', '/hot')
  cy.get('[data-cy="profileDropdown"]').should('be.visible')
  cy.get('[data-cy="profileDropdown"]').click()
  cy.get('[data-cy="chain-select"]').should('be.visible')
  cy.get('[data-cy="chain-select"]').click()
})

Cypress.Commands.add('snekNavbar', () => {
  cy.get('[data-cy="classic"]')
    .should('have.attr', 'href')
    .and('include', '/snek/create')
  cy.get('[data-cy="explore"]').should('be.visible')
  cy.get('[data-cy="chain"]').should('be.visible')
  cy.get('[data-cy="stats"]').should('be.visible')
  cy.get('[data-cy="global-offers"]')
    .should('have.attr', 'href')
    .and('include', '/snek/offers')
  cy.get('[data-cy="offers-stats"]')
    .should('have.attr', 'href')
    .and('include', '/snek/stats')
  cy.get('[data-cy="chain-select"]').should('be.visible')
  cy.get('[data-cy="chain-select"]').click()
})

Cypress.Commands.add('snekGalleryListedItemActions', (nftId, creator) => {
  cy.visit(`/snek/gallery/${nftId}`)
  cy.waitForNetworkIdle('POST', '*', 1000)
  cy.get('[data-cy="money"]').should('contain', 'KSM')
  cy.get('[data-cy="item-buy"]').should('be.disabled')
  cy.get('[data-cy="make-offer"]').should('not.be.disabled')
  cy.get('[data-cy="gallery-item-tabs"]').within(() => {
    cy.get('[role="tab"]').eq(0).should('contain', 'Offers')
    cy.get('[role="tab"]').eq(0).click()
    cy.get('[role="tab"]').eq(1).should('contain', 'Activity')
    cy.get('[role="tab"]').eq(1).click()
  })
  cy.get('[data-cy="events-filter"] input[type="checkbox"]').uncheck({
    force: true,
  })
  cy.get('[data-cy="mints"]').click()
  cy.get('.gallery-item-activity-table').within(() => {
    cy.get('[data-label="Event"]').should('contain', 'mintnft')
    cy.get('[data-label="From"]').should('contain', `${creator}`)
    cy.get('[data-label^="Price"]').should('have.text', '')
  })
})

Cypress.Commands.add('snekGalleryUnlistedItemActions', (nftId) => {
  cy.visit(`/snek/gallery/${nftId}`)
  cy.waitForNetworkIdle('POST', '*', 1000)
  cy.get('[data-cy="make-offer"]').should('not.be.disabled')
})

Cypress.Commands.add('checkCollectionActions', (url, nftName, creator) => {
  cy.visit(url)
  cy.waitForNetworkIdle('POST', '*', 1000)
  cy.get('[data-cy="0"]').should('be.visible')
  cy.get('[data-cy="nft-name"]').contains(nftName)
  cy.get('.is-hidden-mobile .is-hidden-mobile[data-cy="explore-sort"]').click({
    force: true,
  })
  cy.get('.is-hidden-mobile [data-cy="blockNumber_ASC"]').click({
    force: true,
  })
  cy.get('[data-cy="identity"]').should('contain', creator)
  cy.get('[data-cy="share-button"]').should('be.visible')
  cy.get('[data-cy="more-actions-button"]').should('be.visible')
})

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * @desc get selector by data-cy="selector" attribute
       */
      getCy(
        dataTestAttribute: string,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        args?: any
      ): Chainable<JQuery<HTMLElement>>

      /**
       * @desc visits /e2e-login and gets logged in with newly generated random wallet (empty)
       */
      loginWithKeyring(): Chainable<Element>

      /**
       * @desc checks whether the elements of RMRK navbar are visible, goes through some options and clicks them
       */
      rmrkNavbar(): Chainable<Element>

      /**
       * @desc checks whether the elements of snek navbar are visible, goes through some options and clicks them
       */
      snekNavbar(): Chainable<Element>

      /**
       * @desc checks all of the actions available when interacted with listed item on snek
       * @param nftId - ID of nft being tested (if this test fails, check whether this ID is correct)
       * @param creator - creator of nft
       */
      snekGalleryListedItemActions(
        nftId: string,
        creator: string
      ): Chainable<Element>

      /**
       * @desc checks all of the actions available when interacted with unlisted item on snek
       * @param nftId - ID of nft being tested (if this test fails, check whether this ID is correct)
       * @param creator - creator of nft
       */
      snekGalleryUnlistedItemActions(
        nftId: string,
        creator: string
      ): Chainable<Element>

      /**
       * @desc checks all of the actions available when interacted with collection
       * @param url
       * @param nftName
       * @param creator
       */
      checkCollectionActions(
        url: string,
        nftName: string,
        creator: string
      ): Chainable<Element>
    }
  }
}
