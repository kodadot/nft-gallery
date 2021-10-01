import {
  web3Enable,
  web3FromAddress,
} from '@polkadot/extension-dapp';


export const enableExtension = () => web3Enable('KodaDot')

export const getAddress = async (address: string) => {
  try {
    const injector = await web3FromAddress(address);
    return injector
  } catch (e) {
    console.warn(`[EXTENSION] No Addr ${address}`)
    return null
  }
}
