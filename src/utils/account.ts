import { KeyringAccount } from '@/types'
import keyring from '@polkadot/ui-keyring'
import { getAddress } from '@/extension'
import { decodeAddress, encodeAddress, } from '@polkadot/util-crypto'
import store from '@/store'
import { Prefix } from '@polkadot/util-crypto/address/types'

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

const accountToAddress = (account: KeyringAccount | string) => typeof account === 'string' ? account : account.address

export const toDefaultAddress = (account: KeyringAccount | string) => {
  const address = accountToAddress(account)
  if (/^5/.test(address)) {
    return address
  }

  const ss58Format = store.getters.getChainProperties?.ss58Format

  return encodeAddress(decodeAddress(address, ss58Format))

}

export const pubKeyToAddress = (publicKey: string) => {
  const ss58Format = store.getters.getChainProperties?.ss58Format
  return encodeAddress(publicKey, ss58Format)
}

export const formatAccount = (account: KeyringAccount | string, format?: Prefix) => {
  const address = accountToAddress(account)
  const ss58Format = format ? format : store.getters.getChainProperties?.ss58Format
  return encodeAddress(decodeAddress(address), ss58Format)
}

export default passwordRequired
