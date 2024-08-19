import { chainPropListOf } from './chain.config'
import type { PartialConfig, Prefix } from './types'

const hasCreate: PartialConfig = {
  dot: false,
  ksm: false,
  rmrk: false,
}

const hasInsight: PartialConfig = {
  ahk: false,
  ahp: false,
  dot: false,
}

const hasSales: PartialConfig = {
  ahk: false,
  dot: false,
  ahp: false,
}

const hasMassmintCreate: PartialConfig = {
  dot: false,
}

const hasExplorer: PartialConfig = {
  dot: false,
}

export const createVisible = (prefix: Prefix | string): boolean => {
  return isEvm(prefix as Prefix) ? false : hasCreate[prefix] ?? true
}

export const listVisible = (prefix: Prefix | string): boolean => {
  return !isEvm(prefix as Prefix)
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
  return prefix === 'ahk' || prefix === 'ahp' || chainPropListOf(prefix as Prefix).vm === 'EVM'
}

export const explorerVisible = (prefix: Prefix | string): boolean => {
  return hasExplorer[prefix] ?? true
}
