import type { Prefix } from '@kodadot1/static'
import type { ComputedRef } from 'vue'
import { chainPropListOf } from '@/utils/config/chain.config'

export default function (prefix: ComputedRef<Prefix>) {
  const isAssetHub = computed(
    () => prefix.value === 'ahk' || prefix.value === 'ahp', // || prefix.value === 'ahr'
  )

  const isBase = computed(() => 'base' === prefix.value)

  const isEvm = computed(() => chainPropListOf(prefix.value).vm === 'EVM')
  const isSub = computed(() => chainPropListOf(prefix.value).vm === 'SUB')

  return {
    isAssetHub,
    isEvm,
    isSub,
    isBase,
  }
}
