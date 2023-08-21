import { shouldIgnoreKeyDownEvent } from '@/utils/keyboardEvents'
import { useEventListener } from '@vueuse/core'

export function useKeyboardEvents(primaryKeyEvents) {
  const keysPressed = ref({})

  function handleKeyPress(event, keysPressed, primaryKeyEvents) {
    if (shouldIgnoreKeyDownEvent(event)) {
      return
    }

    keysPressed[event.key] = true
    for (const eventKey in primaryKeyEvents) {
      if (keysPressed[eventKey]) {
        primaryKeyEvents[eventKey](event)
      }
    }
  }

  const onKeyDown = (event) => {
    handleKeyPress(event, keysPressed.value, primaryKeyEvents)
  }

  const onKeyUp = (event) => {
    delete keysPressed.value[event.key]
  }

  onMounted(() => {
    // Attach event listeners
    useEventListener(document, 'keydown', onKeyDown)
    useEventListener(document, 'keyup', onKeyUp)
  })
}
