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

const hasHot: Config<boolean> = {
  rmrk: true,
  ksm: true,
  bsx: true,
  ahk: true,
  movr: true,
  glmr: true,
  snek: true,
  dot: true,
  ahp: true,
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
  ahp: false,
}

const hasIdentity: Config<boolean> = {
  rmrk: true,
  ksm: true,
  bsx: true,
  ahk: true,
  movr: true,
  glmr: true,
  snek: true,
  dot: true,
  ahp: true,
}

const hasProfile: Config<boolean> = {
  rmrk: true,
  ksm: true,
  bsx: true,
  ahk: true,
  movr: true,
  glmr: true,
  snek: true,
  dot: true,
  ahp: true,
}

const hasTransfer: Config<boolean> = {
  rmrk: true,
  ksm: true,
  bsx: true,
  ahk: true,
  movr: true,
  glmr: true,
  snek: true,
  dot: true,
  ahp: true,
}

const hasTeleport: Config<boolean> = {
  rmrk: true,
  ksm: true,
  bsx: true,
  ahk: true,
  movr: true,
  glmr: true,
  snek: true,
  dot: true,
  ahp: true,
}

const hasDrops: Config<boolean> = {
  rmrk: false,
  ksm: false,
  bsx: false,
  ahk: true,
  movr: false,
  glmr: false,
  snek: false,
  dot: false,
  ahp: false,
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

export const massmintCreateVisible = (prefix: Prefix | string) => {
  return hasMassmintCreate[prefix]
}

export const salesVisible = (prefix: Prefix | string) => {
  return hasSales[prefix]
}

export const hotVisible = (prefix: Prefix | string) => {
  return hasHot[prefix]
}

export const identityVisible = (prefix: Prefix | string) => {
  return hasIdentity[prefix]
}

export const profileVisible = (prefix: Prefix | string) => {
  return hasProfile[prefix]
}

export const transferVisible = (prefix: Prefix | string) => {
  return hasTransfer[prefix]
}

export const teleportVisible = (prefix: Prefix | string) => {
  return hasTeleport[prefix]
}

export const dropsVisible = (prefix: Prefix | string) => {
  return hasDrops[prefix]
}
