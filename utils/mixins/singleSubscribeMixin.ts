import { Component, Vue } from 'nuxt-property-decorator'
import consola from 'consola'
// declare type UnsubscribePromise = Promise<Unsubscribe>;
declare type Unsubscribe = () => void

/*
 * refer to https://stackoverflow.com/questions/51873087/unable-to-use-mixins-in-vue-with-typescript
 * usage import Component, { mixins } from 'vue-class-component';
 * class ExtendedClass extends mixins(SubscribeMixin) {
 */
@Component
export default class SingleSubscribeMixin extends Vue {
  private sub: Unsubscribe = () => void 0

  public async singleSubscribe(fn: any, args: any[], callback: any) {
    this.unsubscribe() // unsubscribe previous subscription
    fn(...args, callback)
      .then((sub: Unsubscribe) => (this.sub = sub))
      .catch(consola.error)
  }

  private unsubscribe(): void {
    this.sub()
  }

  public beforeDestroy(): void {
    this.unsubscribe()
  }
}
