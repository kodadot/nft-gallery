const IGNORE_KEY_DOWN_EVENT_TAG_NAME_LIST = ['INPUT', 'TEXTAREA']

export const shouldIgnoreKeyDownEvent = (event: KeyboardEvent) => {
  const target = event.target
  const targetTagName = (target as HTMLElement).tagName ?? ''
  if (IGNORE_KEY_DOWN_EVENT_TAG_NAME_LIST.includes(targetTagName)) {
    return true
  }
  return false
}
