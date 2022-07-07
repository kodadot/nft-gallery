import { Prefix } from './indexer.config'

type Config<T = boolean> = Record<Prefix, T>

const hasCreate: Config<boolean> = {
  rmrk: true,
  bsx: true,
  statemine: true,
  westmint: true,
  moonsama: false,
}

export const createVisible = (prefix: Prefix | string): boolean => {
  return hasCreate[prefix]
}
