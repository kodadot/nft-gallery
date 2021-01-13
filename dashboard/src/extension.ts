import {
  web3Accounts,
  web3Enable,
  web3FromAddress,
  web3ListRpcProviders,
  web3UseRpcProvider,
  isWeb3Injected
} from '@polkadot/extension-dapp';


export const enableExtension = () => web3Enable('KodaDot')
