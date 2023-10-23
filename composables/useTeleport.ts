import { Chain, allowedTransitions, chainToPrefixMap } from '@/utils/teleport'
import { web3Enable } from '@polkadot/extension-dapp'
import { notificationTypes, showNotification } from '@/utils/notification'
import { getss58AddressByPrefix } from '@/utils/account'
import { SubmittableResult } from '@polkadot/api'
import { txCb } from '@/utils/transactionExecutor'

type TeleportParams = {
  amount: number
  from: Chain
  to: Chain
  fromAddress: string
  toAddress: string
  currency: string
}

export default function () {
  const error = ref<string | null>(null)
  const txId = ref<string | null>(null)

  const identityStore = useIdentityStore()
  const { isLoading, status, initTransactionLoader, stopLoader } =
    useTransactionStatus()
  const { accountId } = useAuth()
  const { assets } = usePrefix()
  const { decimalsOf } = useChain()
  const { urlPrefix } = usePrefix()

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

  const chain = computed<Chain | null>(
    () => prefixToChainMap[urlPrefix.value] || null,
  )
  const isAvailable = computed(() =>
    Object.keys(allowedTransitions).includes(chain.value || ''),
  )

  const teleport = async ({
    amount,
    from,
    to,
    fromAddress,
    toAddress,
    currency,
    onSuccess,
    onError,
  }: TeleportParams & {
    onSuccess?: (blockHash) => void
    onError?: () => void
  }) => {
    if (!amount || amount < 0) {
      return
    }

    await web3Enable('Kodadot')
    let isFirstStatus = true
    initTransactionLoader()
    status.value = TransactionStatus.Sign
    error.value = null

    const transactionHandler = txCb(
      (blockHash) => {
        showNotification(
          `Transaction finalized at blockHash ${blockHash}`,
          notificationTypes.success,
        )
        status.value = TransactionStatus.Finalized

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
          status.value = TransactionStatus.Block
          isFirstStatus = false
        }
      },
    )

    const errorHandler = () => {
      showNotification('Cancelled', notificationTypes.warn)
      stopLoader()

      error.value = 'cancelled'
      if (onError) {
        onError()
      }
    }

    const promise = await getTransaction({
      amount: amount,
      from: from,
      to: to,
      address: toAddress,
      currency: currency,
    })

    if (promise === undefined) {
      errorHandler()
      return
    }

    const injector = await getAddress(toDefaultAddress(fromAddress))

    promise
      .signAndSend(fromAddress, { signer: injector.signer }, transactionHandler)
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

  const getTransactionFee = async ({
    amount,
    from,
    to,
    toAddress,
    fromAddress,
    currency,
  }: TeleportParams) => {
    const promise = await getTransaction({
      amount: amount,
      from: from,
      to: to,
      address: toAddress,
      currency: currency,
    })

    if (!promise) {
      return
    }

    const injector = await getAddress(toDefaultAddress(fromAddress))

    const info = await promise.paymentInfo(
      fromAddress,
      injector ? { signer: injector.signer } : {},
    )

    return info.partialFee.toString()
  }

  return {
    chain,
    txId,
    error,
    status,
    isLoading,
    isAvailable,
    chainBalances,
    teleport,
    getAddressByChain,
    getChainTokenDecimals,
    getTransactionFee,
  }
}
