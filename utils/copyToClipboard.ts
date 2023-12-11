export function copyToClipboard(
  value: string,
  options?: {
    toast?: boolean
    toastMessage?: string
  },
) {
  const { copy } = useClipboard()
  const { toast } = useToast()

  // Set default values for options
  const { toast: shouldToast = true, toastMessage = 'Copied to clipboard' } =
    options ?? {}

  copy(value)
  fallbackCopyToClipboard(value)
  if (shouldToast) {
    toast(toastMessage)
  }
}

const fallbackCopyToClipboard = (value: string) => {
  const element = document.createElement('textarea')
  element.value = value
  document.body.appendChild(element)
  element.select()
  document.execCommand('copy')
  document.body.removeChild(element)
}
