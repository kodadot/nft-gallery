import { Config, Prefix } from './types'

const hasCreate: Config<boolean> = {
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
