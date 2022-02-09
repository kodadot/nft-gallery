import { Component, Vue } from 'nuxt-property-decorator'

@Component
export default class KeyboardEventsMixin extends Vue {
  private keysPressed = {}
  private primaryKeyEvents = {}

  public created() {
    document.addEventListener('keydown', this.onKeyDown)
    document.addEventListener('keyup', this.onKeyUp)
  }

  public beforeDestroy() {
    document.removeEventListener('keydown', this.onKeyDown)
    document.removeEventListener('keyup', this.onKeyUp)
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
}
