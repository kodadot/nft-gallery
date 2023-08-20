import { shouldIgnoreKeyDownEvent } from '@/utils/keyboardEvents'
import { useEventListener } from '@vueuse/core'

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

  onMounted(() => {
    // Attach event listeners
    useEventListener(document, 'keydown', onKeyDown)
    useEventListener(document, 'keyup', onKeyUp)
  })
}
