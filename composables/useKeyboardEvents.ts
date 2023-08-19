import { shouldIgnoreKeyDownEvent } from '@/utils/keyboardEvents'

export function useKeyboardEvents(primaryKeyEvents) {
  const keysPressed = ref({})

  const onKeyDown = (event) => {
    if (shouldIgnoreKeyDownEvent(event)) {
      return
    }

    keysPressed.value[event.key] = true
    for (const eventKey in primaryKeyEvents) {
      if (keysPressed.value[eventKey]) {
        primaryKeyEvents[eventKey](event)
      }
    }
  }

  const onKeyUp = (event) => {
    delete keysPressed.value[event.key]
  }

  // Attach event listeners
  document.addEventListener('keydown', onKeyDown)
  document.addEventListener('keyup', onKeyUp)

  // Cleanup
  onBeforeUnmount(() => {
    document.removeEventListener('keydown', onKeyDown)
    document.removeEventListener('keyup', onKeyUp)
  })
}
