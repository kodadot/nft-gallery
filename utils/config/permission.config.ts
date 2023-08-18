import { PartialConfig, Prefix } from './types'

const hasCreate: PartialConfig<boolean> = {
  movr: false,
  glmr: false,
  dot: false,
}

const hasInsight: PartialConfig<boolean> = {
  ahk: false,
  movr: false,
  glmr: false,
  ahp: false,
}

const hasSales: PartialConfig<boolean> = {
  ahk: false,
  movr: false,
  glmr: false,
  dot: false,
  ahp: false,
}

const hasMassmintCreate: PartialConfig<boolean> = {
  movr: false,
  glmr: false,
  dot: false,
}

const hasExplorer: PartialConfig<boolean> = {
  dot: false,
}

export const createVisible = (prefix: Prefix | string): boolean => {
  return hasCreate[prefix] ?? true
}

export const seriesInsightVisible = (prefix: Prefix | string) => {
  return hasInsight[prefix] ?? true
}

export const massmintCreateVisible = (prefix: Prefix | string) => {
  return hasMassmintCreate[prefix] ?? true
}

export const salesVisible = (prefix: Prefix | string) => {
  return hasSales[prefix] ?? true
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
