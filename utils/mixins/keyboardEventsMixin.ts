import { Component, Vue } from 'nuxt-property-decorator'

@Component
export default class KeyboardEventsMixin extends Vue {
  private keysPressed = {}
  private primaryKeyEvents = {}

  public created(): void {
    document.addEventListener('keydown', (e) => this.onKeyDown(e))
    document.addEventListener('keyup', (e) => this.onKeyUp(e))
  }

  public beforeDestroy(): void {
    document.removeEventListener('keydown', (e) => this.onKeyDown(e))
    document.removeEventListener('keyup', (e) => this.onKeyUp(e))
  }

  public initKeyboardEventHandler(primaryKeyEvents): void {
    this.primaryKeyEvents = primaryKeyEvents
  }

  private onKeyDown(event) {
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
