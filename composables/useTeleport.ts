import {
  Chain,
  chainToPrefixMap
} from '@/utils/teleport'
import { web3Enable } from '@polkadot/extension-dapp'
import { notificationTypes, showNotification } from '@/utils/notification'
import { getss58AddressByPrefix } from '@/utils/account'


export default function () {
  const identityStore = useIdentityStore()
  const isLoading = ref(false)
  const { accountId } = useAuth()
  const { assets } = usePrefix()
  const { decimalsOf } = useChain()

  const chainBalances = {
    [Chain.KUSAMA]: () =>
      identityStore.multiBalances.chains.kusama?.ksm?.nativeBalance,
    [Chain.BASILISK]: () =>
      identityStore.multiBalances.chains.basilisk?.ksm?.nativeBalance,
    [Chain.STATEMINE]: () =>
      identityStore.multiBalances.chains.kusamaHub?.ksm?.nativeBalance,
    [Chain.POLKADOT]: () =>
      identityStore.multiBalances.chains.polkadot?.dot?.nativeBalance,
    [Chain.STATEMINT]: () =>
      identityStore.multiBalances.chains.polkadotHub?.dot?.nativeBalance,
  }

const teleport = async ({
  amount, from, to, fromAddress, toAddress, currency, onSuccess
}: { amount: number, from: Chain, to: Chain, fromAddress: string, toAddress: string, currency: string , onSuccess?: (blockHash) => void}) => {

  if (!amount || amount < 0) {
    return
  }

  await web3Enable('Kodadot')
  let isFirstStatus = true
  isLoading.value = true
  const transactionHandler = txCb(
    (blockHash) => {
      showNotification(
        `Transaction finalized at blockHash ${blockHash}`,
        notificationTypes.success,
      )
      isLoading.value = false
      if (onSuccess) {
        onSuccess(blockHash)
      }
    },
    (dispatchError) => {
      showNotification(dispatchError.toString(), notificationTypes.warn)
      isLoading.value = false
    },
    ({ txHash }) => {
      if (isFirstStatus) {
        showNotification(
          `Transaction hash is ${txHash.toHex()}`,
          notificationTypes.info,
        )
        isFirstStatus = false
      }
    },
  )

  const errorHandler = () => {
    showNotification('Cancelled', notificationTypes.warn)
    isLoading.value = false
  }


  const promise = await getTransaction({
    amount: amount,
    from: from,
    to: to,
    address: toAddress,
    currency: currency
  })

  if (promise === undefined) {
    return
  }

  const injector = await getAddress(toDefaultAddress(fromAddress))

  promise
    .signAndSend(
      fromAddress,
      { signer: injector.signer },
      transactionHandler,
    )
    .catch(errorHandler)
}


const getAddressByChain = (chain: Chain) => {
  return getss58AddressByPrefix(accountId.value, chainToPrefixMap[chain])
}

const getChainTokenDecimals = (chain: Chain) => {
  switch (chain) {
    case Chain.KUSAMA:
    case Chain.BASILISK:
    case Chain.STATEMINE:
      return assets(5).decimals
    case Chain.POLKADOT:
      return decimalsOf('dot')
    case Chain.STATEMINT:
      return decimalsOf('ahp')
  }
}

  return {
    chainBalances,
    teleport,
    isLoading,
    getAddressByChain,
    getChainTokenDecimals
  }
}