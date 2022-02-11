import { Component, Vue } from 'nuxt-property-decorator'

@Component
export default class KeyboardEventsMixin extends Vue {
  private keysPressed = {}
  private primaryKeyEvents = {}

  public created(): void {
    document.addEventListener('keydown', this.onKeyDown.bind(this))
    document.addEventListener('keyup', this.onKeyUp.bind(this))
  }

  public beforeDestroy(): void {
    document.removeEventListener('keydown', this.onKeyDown.bind(this))
    document.removeEventListener('keyup', this.onKeyUp.bind(this))
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
