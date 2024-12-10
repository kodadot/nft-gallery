import type { Prefix } from '@kodadot1/static'
import type { ComputedRef } from 'vue'
import { vmOf } from '@/utils/config/chain.config'

export const isEvm = (prefix: Prefix) => vmOf(prefix) === 'EVM'
export const isSub = (prefix: Prefix) => vmOf(prefix) === 'SUB'
export const isAssetHub = (prefix: Prefix) => prefix === 'ahk' || prefix === 'ahp'// || prefix.value === 'ahr'

export default function (prefix: ComputedRef<Prefix>) {
  const isBase = computed(() => 'base' === prefix.value)

  return {
    isBase,
    isAssetHub: computed(() => isAssetHub(prefix.value)),
    isEvm: computed(() => isEvm(prefix.value)),
    isSub: computed(() => isSub(prefix.value)),
  }
}
