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
  dot: false,
}

const hasExplorer: Config<boolean> = {
  rmrk: true,
  ksm: true,
  bsx: true,
  stmn: true,
  westmint: true,
  movr: true,
  glmr: true,
  snek: true,
  dot: false,
}

export const createVisible = (prefix: Prefix | string): boolean => {
  return hasCreate[prefix]
}

export const explorerVisible = (prefix: Prefix | string): boolean => {
  return hasExplorer[prefix] ?? true
}
