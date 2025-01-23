const currentBlock = ref(0)
const subscription = ref()
const syncCount = ref(0)

export default function useCurrentBlock() {
  const { apiInstance } = useApi()

  syncCount.value++

  if (!subscription.value) {
    onBeforeMount(async () => {
      const api = await apiInstance.value
      subscription.value = await api.rpc.chain.subscribeNewHeads((lastHeader) => {
        currentBlock.value = lastHeader.number.toNumber()
      })
    })
  }

  onBeforeUnmount(() => {
    syncCount.value--

    if (syncCount.value === 0 && subscription.value) {
      subscription.value()
      subscription.value = undefined
    }
  })

  return currentBlock
}
