describe('redirect middleware', () => {
  it('should redirect from rmrk2 prefix to ksm', () => {
    cy.visit(
      '/rmrk2/gallery/17842583-22708b368d163c8007-CITY-LOWER_ART_DISTRICT-00000006',
    )
    cy.url().should(
      'include',
      '/ksm/gallery/17842583-22708b368d163c8007-CITY-LOWER_ART_DISTRICT-00000006',
    )

    cy.visit('/rmrk2/explore/items?listed=true&sort=updatedAt_DESC')
    cy.url().should(
      'include',
      '/ksm/explore/items?listed=true&sort=updatedAt_DESC',
    )
  })
})
