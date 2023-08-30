import { usePreferencesStore } from '@/stores/preferences'
import {
  ActionMintToken,
  Max,
  MintTokenParams,
  MintedCollection,
  TokenToMint,
} from '../types'

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

export const getNameInNotifications = (item: ActionMintToken) => {
  return Array.isArray(item.token)
    ? item.token.map((t) => t.name).join(', ')
    : item.token.name
}

export const transactionFactory = (getArgs) => {
  return async (mintTokenParams: MintTokenParams) => {
    const { item, api, executeTransaction, isLoading, status } = mintTokenParams
    const { $i18n } = useNuxtApp()

    isLoading.value = true
    status.value = 'loader.ipfs'
    const args = await getArgs(item, api)

    const nameInNotifications = getNameInNotifications(item)

    executeTransaction({
      cb: api.tx.utility.batchAll,
      arg: args,
      successMessage:
        item.successMessage ||
        ((blockNumber) =>
          $i18n.t('mint.mintNFTSuccess', {
            name: nameInNotifications,
            block: blockNumber,
          })),
      errorMessage:
        item.errorMessage ||
        $i18n.t('mint.errorCreateNewNft', { name: nameInNotifications }),
    })
  }
}

export const expandCopies = <T extends TokenToMint>(tokens: T[]): T[] => {
  return tokens.flatMap((token) => {
    const copies = copiesToMint(token)
    if (copies === 1) {
      return token
    }

    return Array(copies)
      .fill(null)
      .map((_, index) => {
        return {
          ...token,
          name: token.postfix ? `${token.name} #${index + 1}` : token.name,
        }
      })
  })
}
