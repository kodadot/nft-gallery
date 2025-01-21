import { SECONDS_PER_BLOCK } from '@/composables/transaction/transactionOffer'

const currentBlock = ref(0)
const interval = ref<NodeJS.Timeout>()
const syncCount = ref(0)

export default function useCurrentBlock() {
  const { apiInstance } = useApi()

  const getCurrentBlock = async () => {
    const api = await apiInstance.value
    const { number } = await api.rpc.chain.getHeader()
    return number.toNumber()
  }

  const syncCurrentBlock = async () => {
    currentBlock.value = await getCurrentBlock()
  }

  syncCount.value++

  if (syncCount.value === 1) {
    onBeforeMount(async () => {
      await syncCurrentBlock()
      interval.value = setInterval(syncCurrentBlock, SECONDS_PER_BLOCK * 1000)
    })
  }

  onBeforeUnmount(() => {
    syncCount.value--

    if (syncCount.value === 0 && interval.value) {
      clearInterval(interval.value)
      interval.value = undefined
    }
  })

  return currentBlock
}
