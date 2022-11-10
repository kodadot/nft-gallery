import { Config, Prefix } from './types'

const hasCreate: Config<boolean> = {
  // After *bsx* & *snek* are true again, turn on tests
  // tests/cypress/e2e/basicE2E.cy.ts 6th line, 16th line checkNavbar (for bsx & snek)
  rmrk: true,
  bsx: false,
  statemine: true,
  westmint: true,
  movr: false,
  glmr: false,
  snek: false,
}

export const createVisible = (prefix: Prefix | string): boolean => {
  return hasCreate[prefix]
}
