import { PartialConfig } from '@/utils/config/types'

export default function () {
  const { urlPrefix } = usePrefix()

  const paraChainBlockTime = 12 //seconds
  const relayChainBlockTime = 6 //seconds

  const chainBlockTimes: PartialConfig<number> = {
    ksm: relayChainBlockTime,
    dot: relayChainBlockTime,
    rmrk: relayChainBlockTime,
  }

  const blockTime = computed(
    () => chainBlockTimes[urlPrefix.value] ?? paraChainBlockTime,
  )

  const estimatedTimes = computed(() => ({
    [TransactionStatus.Broadcast]: 3 * blockTime.value,
    [TransactionStatus.Block]: 2 * blockTime.value,
  }))

  return {
    blockTime,
    estimatedTimes,
  }
}
