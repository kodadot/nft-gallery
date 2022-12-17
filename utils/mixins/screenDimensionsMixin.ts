import { Component, Vue } from 'nuxt-property-decorator'
/*
 * refer to https://stackoverflow.com/questions/51873087/unable-to-use-mixins-in-vue-with-typescript
 * usage import Component, { mixins } from 'vue-class-component';
 * class ExtendedClass extends mixins(SubscribeMixin) {
 */
@Component
export default class ScreenDimesionsMixin extends Vue {
  protected screenDimensions = {
    width: window.innerWidth,
    height: window.innerHeight,
  }
  protected mobile = 768
  protected desktop = 1024

  protected onResize() {
    this.screenDimensions = {
      width: window.innerWidth,
      height: window.innerHeight,
    }
  }

  get istouch() {
    return this.screenDimensions.width < this.desktop
  }

  get isMobile() {
    return this.screenDimensions.width <= this.mobile
  }

  mounted() {
    this.$nextTick(() => {
      window.addEventListener('resize', this.onResize)
    })
  }
  beforeDestroy() {
    window.removeEventListener('resize', this.onResize)
  }
}
