import {
  Chain,
  chainToPrefixMap
} from '@/utils/teleport'
import { web3Enable } from '@polkadot/extension-dapp'
import { notificationTypes, showNotification } from '@/utils/notification'
import { getss58AddressByPrefix } from '@/utils/account'
import { SubmittableResult } from '@polkadot/api'


export default function () {
  const error = ref<string| null>(null)
  const txId = ref<string| null>(null)

  const identityStore = useIdentityStore()
  const {isLoading, status, initTransactionLoader , stopLoader } = useTransactionStatus()
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
  amount, from, to, fromAddress, toAddress, currency, onSuccess, onError,
}: { amount: number, from: Chain, to: Chain, fromAddress: string, toAddress: string, currency: string , onSuccess?: (blockHash) => void, onError?: () => void}) => {

  if (!amount || amount < 0) {
    return
  }

  await web3Enable('Kodadot')
  let isFirstStatus = true
  initTransactionLoader()
  status.value = TransactionStatus.Sign

  const transactionHandler = txCb(
    (blockHash) => {
      showNotification(
        `Transaction finalized at blockHash ${blockHash}`,
        notificationTypes.success,
      )
      status.value = TransactionStatus.Block

      if (onSuccess) {
        onSuccess(blockHash)
      }
    },
    (dispatchError) => {
      showNotification(dispatchError.toString(), notificationTypes.warn)
      stopLoader()
      error.value = dispatchError.toString()

      if (onError) {
        onError()
      }
    },
    (submittableResult: SubmittableResult) => {
      const { txHash } = submittableResult
      
      if (isFirstStatus) {
        showNotification(
          `Transaction hash is ${txHash.toHex()}`,
          notificationTypes.info,
        )
        txId.value = txHash.toHex()
        status.value = TransactionStatus.Finalized
        isFirstStatus = false
      }
    },
  )

  const errorHandler = () => {
    showNotification('Cancelled', notificationTypes.warn)
    stopLoader()

    if (onError) {
      onError()
    }
  }


  const promise = await getTransaction({
    amount: amount,
    from: from,
    to: to,
    address: toAddress,
    currency: currency
  })

  if (promise === undefined) {
    errorHandler()
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
    txId,
    error, 
    status,
    isLoading,
    getAddressByChain,
    getChainTokenDecimals
  }
}