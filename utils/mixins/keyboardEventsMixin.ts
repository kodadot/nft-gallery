import { Component, Vue } from 'nuxt-property-decorator'

@Component
export default class KeyboardEventsMixin extends Vue {
  private keysPressed = {}
  private primaryKeyEvents = {}

  public created() {
    this.addKeyboardEvents()
  }

  public beforeDestroy() {
    this.removeKeyboardEvents()
  }

  public initKeyboardEventHandler(primaryKeyEvents) {
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

  private addKeyboardEvents() {
    document.addEventListener('keydown', this.onKeyDown)
    document.addEventListener('keyup', this.onKeyUp)
  }

  private removeKeyboardEvents() {
    document.removeEventListener('keydown', this.onKeyDown)
    document.removeEventListener('keyup', this.onKeyUp)
  }
}
