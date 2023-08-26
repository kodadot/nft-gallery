import { ExtrinsicStatus } from '@polkadot/types/interfaces'

export enum TransactionStatus {
  Broadcast = 'loader.broadcast',
  Casting = 'loader.casting',
  Sign = 'loader.sign',
  Block = 'loader.block',
  Finalized = 'loader.finalized',
  Unkonwn = '',
  IPFS = 'loader.ipfs',
}

function useTransactionStatus() {
  const status = ref<TransactionStatus>(TransactionStatus.Unkonwn)
  const isLoading = ref(false)

  const resolveStatus = (
    extrinsicStatus: ExtrinsicStatus,
    omitFinalized?: boolean
  ): void => {
    if (extrinsicStatus.isBroadcast) {
      status.value = TransactionStatus.Broadcast
      return
    }
    if (extrinsicStatus.isReady) {
      status.value = TransactionStatus.Casting
      return
    }

    if (extrinsicStatus.isInBlock) {
      status.value = TransactionStatus.Block
      return
    }

    if (extrinsicStatus.isFinalized) {
      status.value = omitFinalized
        ? TransactionStatus.Unkonwn
        : TransactionStatus.Finalized
      return
    }

    status.value = TransactionStatus.Unkonwn
  }

  const initTransactionLoader = (): void => {
    isLoading.value = true
    status.value = TransactionStatus.Unkonwn
  }

  const stopLoader = (): void => {
    isLoading.value = false
    status.value = TransactionStatus.Unkonwn
  }
  return {
    status,
    isLoading,
    resolveStatus,
    initTransactionLoader,
    stopLoader,
  }
}

export default useTransactionStatus
