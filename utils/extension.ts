import { web3Enable, web3FromAddress } from '@polkadot/extension-dapp'
import { WalletAccount } from '@/utils/config/wallets'

export const enableExtension = async () => await web3Enable('KodaDot')

export const getAddress = async (address: string) => {
  try {
    const injector = await web3FromAddress(address)
    return injector
  } catch (e) {
    console.warn(`[EXTENSION] No Addr ${address}`)
    return null
  }
}

export const getSelectedAccount = (accounts: WalletAccount[]) => {
  try {
    const selectedAddress = localStorage.getItem('kodaauth')
    const account = accounts.find(
      (account) => account.address === selectedAddress
    )

    return account
  } catch (error) {
    console.error(error)
    return null
  }
}

export const isMobileDevice =
  'ontouchstart' in document.documentElement &&
  navigator.userAgent.match(/Mobi/)
