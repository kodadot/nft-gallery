type TransactionNotification = {
  status: Ref<TransactionStatus>
  isError: Ref<boolean>
  sessionId: Ref<string | undefined >
  init: () => void
  updateSession: ReturnType<typeof useLoadingNotfication>['updateSession']
  initOn?: TransactionStatus[]
}

export default function ({ status, isError, sessionId, init, updateSession, initOn = [TransactionStatus.Broadcast] }: TransactionNotification) {
  watchEffect(() => {
    if (initOn.includes(status.value)) {
      init()
      return
    }
  })

  useTransactionTracker({
    successStatus: [TransactionStatus.Finalized],
    transaction: {
      isError,
      status,
    },
    onSuccess: () => {
      if (sessionId.value) {
        updateSession(sessionId.value, {
          state: 'succeeded',
        })
      }
    },
    onError: () => {
      if (sessionId.value) {
        updateSession(sessionId.value, { state: 'failed', error: isError.value })
      }
    },
  })
}
