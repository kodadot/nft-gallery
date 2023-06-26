import { usePreferencesStore } from '@/stores/preferences'
import { Max, MintedCollection, TokenToMint } from '../types'

export const copiesToMint = <T extends TokenToMint>(token: T): number => {
  const { copies, selectedCollection } = token
  const { alreadyMinted, max } = selectedCollection as MintedCollection & Max
  const maxAllowedNftsInCollection = (max || 0) === 0 ? Infinity : max
  const remaining = maxAllowedNftsInCollection - alreadyMinted

  // Default to 1 if copies is less than 1 or not defined
  return Math.min(copies && copies >= 1 ? copies : 1, remaining)
}

export const calculateFees = () => {
  const preferences = usePreferencesStore()
  const enabledFees: boolean =
    preferences.getHasSupport || preferences.getHasCarbonOffset

  const feeMultiplier =
    Number(preferences.getHasSupport) +
    2 * Number(preferences.getHasCarbonOffset)

  return { enabledFees, feeMultiplier }
}
