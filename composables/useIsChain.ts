import type { Prefix } from '@kodadot1/static'

export default function (prefix: Prefix) {
  const isBasilisk = computed(() => prefix === 'bsx' || prefix === 'snek')
  const isRemark = computed(() => prefix === 'rmrk' || prefix === 'ksm')
  const isAssetHub = computed(() => prefix === 'stmn' || prefix === 'stt')

  return {
    isBasilisk,
    isRemark,
    isAssetHub,
  }
}
