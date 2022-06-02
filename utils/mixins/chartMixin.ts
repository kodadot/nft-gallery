import { Component, Vue } from 'nuxt-property-decorator'
/*
 * refer to https://stackoverflow.com/questions/51873087/unable-to-use-mixins-in-vue-with-typescript
 * usage import Component, { mixins } from 'vue-class-component';
 * class ExtendedClass extends mixins(SubscribeMixin) {
 */
@Component
export default class ChartMixin extends Vue {
  protected onCanvasMouseDownBar(id: string): void {
    document!.getElementById(id)!.style!.cursor = 'grabbing'
  }

  protected onCanvasMouseUpBar(id: string): void {
    document!.getElementById(id)!.style!.cursor = 'auto'
  }

  protected onCanvasMouseLeaveBar(id: string): void {
    document!.getElementById(id)!.style!.cursor = 'auto'
  }
}
