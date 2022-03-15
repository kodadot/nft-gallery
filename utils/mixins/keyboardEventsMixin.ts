import { Component, Vue } from 'nuxt-property-decorator'
import { shouldIgnoreKeyDownEvent } from '@/utils/keyboardEvents'
@Component
export default class KeyboardEventsMixin extends Vue {
  private keysPressed = {}
  private primaryKeyEvents = {}

  public created(): void {
    document.addEventListener('keydown', this.onKeyDown)
    document.addEventListener('keyup', this.onKeyUp)
  }

  public beforeDestroy(): void {
    document.removeEventListener('keydown', this.onKeyDown)
    document.removeEventListener('keyup', this.onKeyUp)
  }

  public initKeyboardEventHandler(primaryKeyEvents): void {
    this.primaryKeyEvents = primaryKeyEvents
  }

  private onKeyDown(event: KeyboardEvent) {
    if (shouldIgnoreKeyDownEvent(event)) {
      return
    }

    this.keysPressed[event.key] = true
    for (const eventKey in this.primaryKeyEvents) {
      if (this.keysPressed[eventKey]) {
        this.primaryKeyEvents[eventKey](event)
      }
    }
  }

  private onKeyUp(event) {
    delete this.keysPressed[event.key]
  }
}
