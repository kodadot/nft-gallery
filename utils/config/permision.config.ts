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
  stt: false,
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
  stt: true,
}

const hasInsight: Config<boolean> = {
  rmrk: true,
  ksm: false,
  bsx: true,
  stmn: false,
  movr: false,
  glmr: false,
  snek: false,
  dot: false,
  stt: false,
}

export const createVisible = (prefix: Prefix | string): boolean => {
  return hasCreate[prefix]
}

export const explorerVisible = (prefix: Prefix | string): boolean => {
  return hasExplorer[prefix] ?? true
}

export const seriesInsightVisible = (prefix: Prefix | string) => {
  return hasInsight[prefix]
}
