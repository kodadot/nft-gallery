import { useClipboard } from '@vueuse/core'

export default function useCopyClipboard() {
  const { text, copy, copied, isSupported } = useClipboard({ legacy: true })

  return {
    text,
    copy,
    copied,
    isSupported,
  }
}
