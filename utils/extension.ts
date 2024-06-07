import { web3Enable } from '@polkadot/extension-dapp'
import { getWalletBySource } from '@/utils/config/wallets'

export const enableExtension = async () => await web3Enable('KodaDot')

export const getInjectedExtensions = async () => {
  const extensions = await web3Enable('Kodadot')
  return extensions
}

export const getAddress = async (address: string) => {
  try {
    const walletName = useWalletStore().selected?.extension
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

export const isMobileDevice =
  'ontouchstart' in document.documentElement && /Mobi/.test(navigator.userAgent)
