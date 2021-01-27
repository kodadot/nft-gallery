import { KeyringAccount } from '@/types';
import keyring from '@polkadot/ui-keyring';
import { getAddress } from '@/extension'

export const isAccountLocked = (account: KeyringAccount | string): boolean => {
  const address = typeof account === 'string' ? account : account.address;
  // DEV: Account return true when addres is not available 
  if (keyring.isAvailable(address)) {
    return false
  }

  const pair = keyring.getPair(address);
  return pair.isLocked
}

const passwordRequired = async (account: KeyringAccount | string) => {
  const address = typeof account === 'string' ? account : account.address;
  const extensionAccount = await getAddress(address)
  if (!extensionAccount) {
    return false
  }


  return isAccountLocked(address)
}

export default passwordRequired
