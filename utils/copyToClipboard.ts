export function copyToClipboard(
  value: string,
  options = { toast: true, toastMessage: 'Copied to clipboard' },
) {
  const { copy } = useClipboard()
  const { toast } = useToast()

  copy(value)
  fallbackCopyToClipboard(value)
  if (options.toast) {
    toast(options.toastMessage)
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
