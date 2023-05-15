import { Config, Prefix } from './types'

const hasCreate: Config<boolean> = {
  rmrk: true,
  ksm: true,
  bsx: true,
  stmn: false,
  westmint: true,
  movr: false,
  glmr: false,
  snek: true,
}

export const createVisible = (prefix: Prefix | string): boolean => {
  return hasCreate[prefix]
}
