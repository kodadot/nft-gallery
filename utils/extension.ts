import { WalletAccount, getWalletBySource } from '@/utils/config/wallets'
import consola from 'consola'

export const getAddress = async (address: string) => {
  try {
    const walletName = process.client && localStorage.getItem('wallet')
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
    const selectedAddress = process.client && localStorage.getItem('kodaauth')
    const account = accounts.find(
      (account) => account.address === selectedAddress,
    )

    return account
  } catch (error) {
    consola.error(error)
    return null
  }
}

export const isMobileDevice =
  process.client &&
  'ontouchstart' in document.documentElement &&
  /Mobi/.test(navigator.userAgent)
