import { ExtrinsicStatus } from '@polkadot/types/interfaces'

function useTransactionStatus() {
  const status = ref('')
  const isLoading = ref(false)

  const resolveStatus = (
    extrinsicStatus: ExtrinsicStatus,
    omitFinalized?: boolean
  ): void => {
    if (extrinsicStatus.isReady) {
      status.value = 'loader.casting'
      return
    }

    if (extrinsicStatus.isInBlock) {
      status.value = 'loader.block'
      return
    }

    if (extrinsicStatus.isFinalized) {
      status.value = omitFinalized ? '' : 'loader.finalized'
      return
    }

    status.value = ''
  }

  const initTransactionLoader = (): void => {
    isLoading.value = true
    status.value = 'loader.sign'
  }

  const stopLoader = (): void => {
    isLoading.value = false
    status.value = ''
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
