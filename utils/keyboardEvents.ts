export const shouldIgnoreKeyDownEvent = (event: KeyboardEvent) => {
  const target = event.target
  if (target && (target as HTMLElement).tagName === 'INPUT') {
    return true
  }
  return false
}
