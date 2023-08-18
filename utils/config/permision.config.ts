import { Config, Prefix } from './types'

const hasCreate: Config<boolean> = {
  rmrk: true,
  ksm: true,
  bsx: true,
  ahk: true,
  movr: false,
  glmr: false,
  snek: true,
  dot: false,
  ahp: true,
}

const hasInsight: Config<boolean> = {
  rmrk: true,
  ksm: true,
  bsx: true,
  ahk: false,
  movr: false,
  glmr: false,
  snek: true,
  dot: true,
  ahp: false,
}

const hasSales: Config<boolean> = {
  rmrk: true,
  ksm: true,
  bsx: true,
  ahk: false,
  movr: false,
  glmr: false,
  snek: true,
  dot: false,
  ahp: false,
}

const hasMassmintCreate: Config<boolean> = {
  rmrk: true,
  ksm: true,
  bsx: true,
  ahk: true,
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
  ahk: true,
  movr: true,
  glmr: true,
  snek: true,
  dot: false,
  ahp: true,
}

export const createVisible = (prefix: Prefix | string): boolean => {
  return hasCreate[prefix]
}

export const seriesInsightVisible = (prefix: Prefix | string) => {
  return hasInsight[prefix]
}

export const massmintCreateVisible = (prefix: Prefix | string) => {
  return hasMassmintCreate[prefix]
}

export const salesVisible = (prefix: Prefix | string) => {
  return hasSales[prefix]
}

export const dropsVisible = (prefix: Prefix | string) => {
  return prefix === 'ahk'
}

export const assetsVisible = (prefix: Prefix | string) => {
  return prefix === 'bsx' || prefix === 'snek'
}

export const incomingOfferssVisible = (prefix: Prefix | string) => {
  return prefix === 'bsx' || prefix === 'snek'
}

export const explorerVisible = (prefix: Prefix | string): boolean => {
  return hasExplorer[prefix] ?? true
}
