import { RemarkVersion } from '@kodadot1/minimark/shared'

export default function () {
  const { urlPrefix } = usePrefix()

  const version = computed<RemarkVersion | null>(() => {
    switch (urlPrefix.value) {
      case 'rmrk':
        return '1.0.0'
      case 'ksm':
        return '2.0.0'
      default:
        return null
    }
  })

  const isRemark = computed<boolean>(() => version.value !== null)
  const isV2 = computed<boolean>(() => version.value === '2.0.0')

  return {
    isRemark,
    isV2,
    version,
  }
}
