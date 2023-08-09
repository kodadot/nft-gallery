import { Config, Prefix } from './types'

const hasCreate: Config<boolean> = {
  rmrk: true,
  ksm: true,
  bsx: true,
  stmn: true,
  movr: false,
  glmr: false,
  snek: true,
  dot: false,
  ahp: true,
}

const hasExplorer: Config<boolean> = {
  rmrk: true,
  ksm: true,
  bsx: true,
  stmn: true,
  movr: true,
  glmr: true,
  snek: true,
  dot: false,
  ahp: true,
}

export const createVisible = (prefix: Prefix | string): boolean => {
  return hasCreate[prefix]
}

export const explorerVisible = (prefix: Prefix | string): boolean => {
  return hasExplorer[prefix] ?? true
}
