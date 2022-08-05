import { Prefix, Config } from './types'

const hasCreate: Config<boolean> = {
  rmrk: true,
  bsx: true,
  statemine: true,
  westmint: true,
  moonsama: false,
  snek: true,
}

export const createVisible = (prefix: Prefix | string): boolean => {
  return hasCreate[prefix]
}
