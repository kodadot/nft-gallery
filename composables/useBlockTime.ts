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

  const blocktime = computed(
    () => chainBlockTimes[urlPrefix.value] ?? paraChainBlockTime
  )
  return {
    blocktime,
  }
}
