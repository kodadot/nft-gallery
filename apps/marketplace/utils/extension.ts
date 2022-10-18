import { web3Enable } from '@polkadot/extension-dapp'
import { WalletAccount, getWalletBySource } from '@/utils/config/wallets'
import consola from 'consola'

export const enableExtension = async () => await web3Enable('KodaDot')

export const getInjectedExtensions = async () => {
  const extensions = await web3Enable('Kodadot')
  return extensions
}

export const getAddress = async (address: string) => {
  try {
    const walletName = localStorage.getItem('wallet')
    const wallet = getWalletBySource(walletName)
    await wallet?.enable()
    if (wallet?.extension) {
      return wallet.extension
    }

    throw new Error('Wallet not found')
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
    consola.error(error)
    return null
  }
}

export const isMobileDevice =
  'ontouchstart' in document.documentElement && /Mobi/.test(navigator.userAgent)
