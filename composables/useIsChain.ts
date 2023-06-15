import type { Prefix } from '@kodadot1/static'
import type { ComputedRef } from 'vue'

export default function (prefix: ComputedRef<Prefix>) {
  const isBasilisk = computed(
    () => prefix.value === 'bsx' || prefix.value === 'snek'
  )
  const isRemark = computed(
    () => prefix.value === 'rmrk' || prefix.value === 'ksm'
  )
  const isAssetHub = computed(
    () => prefix.value === 'stmn' || prefix.value === 'stt'
  )

  return {
    isBasilisk,
    isRemark,
    isAssetHub,
  }
}
