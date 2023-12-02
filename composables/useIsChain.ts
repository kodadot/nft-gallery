import type { Prefix } from '@kodadot1/static'
import type { Ref } from 'vue'

export default function (prefix: Ref<Prefix>) {
  const isBasilisk = useState('isBasilisk')
  const isRemark = useState('isRemark')
  const isAssetHub = useState('isAssetHub')
  const isRmrk = useState('isRmrk')

  onMounted(() => {
    isBasilisk.value = prefix.value === 'bsx'
    isRemark.value = prefix.value === 'rmrk' || prefix.value === 'ksm'
    isAssetHub.value = prefix.value === 'ahk' || prefix.value === 'ahp'
    isRmrk.value = prefix.value === 'rmrk'
  })

  watch(prefix, () => {
    isBasilisk.value = prefix.value === 'bsx'
    isRemark.value = prefix.value === 'rmrk' || prefix.value === 'ksm'
    isAssetHub.value = prefix.value === 'ahk' || prefix.value === 'ahp'
    isRmrk.value = prefix.value === 'rmrk'
  })

  return {
    isBasilisk,
    isRemark,
    isAssetHub,
    isRmrk,
  }
}
