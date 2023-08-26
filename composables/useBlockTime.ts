import { Prefix } from '@kodadot1/static'

export default function () {
  const { urlPrefix } = usePrefix()

  const paraChainBlockTime = 12 //seconds
  const relayChainBlockTime = 6 //seconds

  const chainBlockTimes: { [K in Prefix]: number } = {
    ksm: relayChainBlockTime,
    dot: relayChainBlockTime,
    rmrk: relayChainBlockTime,
    ahk: paraChainBlockTime,
    ahp: paraChainBlockTime,
    bsx: paraChainBlockTime,
    snek: paraChainBlockTime,
    movr: paraChainBlockTime,
    glmr: paraChainBlockTime,
  }

  const blocktime = computed(() => chainBlockTimes[urlPrefix.value])

  return {
    blocktime,
  }
}
