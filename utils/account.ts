import { KeyringAccount } from '@/utils/types/types'
import keyring from '@polkadot/ui-keyring'
import { getAddress } from '@/utils/extension'
import {
  addressEq,
  addressToEvm,
  decodeAddress,
  encodeAddress,
} from '@polkadot/util-crypto'
import { Prefix } from '@polkadot/util-crypto/address/types'
import { ss58Of } from './config/chain.config'
import { useChainStore } from '@/stores/chain'

export const isAccountLocked = (account: KeyringAccount | string): boolean => {
  const address = typeof account === 'string' ? account : account.address
  // DEV: Account return true when addres is not available
  if (keyring.isAvailable(address)) {
    return false
  }

  const pair = keyring.getPair(address)
  return pair.isLocked
}

const passwordRequired = async (account: KeyringAccount | string) => {
  const address = typeof account === 'string' ? account : account.address
  const extensionAccount = await getAddress(address)
  if (!extensionAccount) {
    return false
  }

  return isAccountLocked(address)
}

const accountToAddress = (account: KeyringAccount | string) =>
  typeof account === 'string' ? account : account.address

export const toDefaultAddress = (account: KeyringAccount | string) => {
  const address = accountToAddress(account)
  if (/^5/.test(address)) {
    return address
  }

  const chainStore = useChainStore()
  const ss58Format = chainStore.getChainProperties58Format

  return encodeAddress(decodeAddress(address, <any>ss58Format))
}

export const formatAddress = (address: string, ss58Format: number) =>
  encodeAddress(address, ss58Format)

export const pubKeyToAddress = (publicKey: string) => {
  const chainStore = useChainStore()
  const ss58Format = chainStore.getChainProperties58Format
  return encodeAddress(publicKey, <any>ss58Format)
}

export const formatAccount = (
  account: KeyringAccount | string,
  format?: Prefix
) => {
  const address = accountToAddress(account)
  const chainStore = useChainStore()
  const ss58Format = format ? format : chainStore.getChainProperties58Format
  return encodeAddress(decodeAddress(address), <any>ss58Format)
}

export const isSameAccount = (
  account1: KeyringAccount | string,
  account2: KeyringAccount | string
): boolean => {
  const address1 = accountToAddress(account1)
  const address2 = accountToAddress(account2)
  return addressEq(address1, address2)
}

export const isOwner = (
  account1?: KeyringAccount | string,
  account2?: KeyringAccount | string
): boolean => {
  return Boolean(account1 && account2 && isSameAccount(account1, account2))
}

export const accountToEvm = (account: KeyringAccount | string): string => {
  const address = accountToAddress(account)
  return addressToEvm(address)?.toString()
}

export const getss58AddressByPrefix = (address: string, prefix: string) => {
  const ss58Format = ss58Of(prefix)
  const decodedAddress = decodeAddress(address)
  return encodeAddress(decodedAddress, ss58Format)
}

export default passwordRequired
