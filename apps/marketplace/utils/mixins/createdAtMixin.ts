import { Component, Vue } from 'nuxt-property-decorator'
import { formatDistanceToNow } from 'date-fns'
/*
 * refer to https://stackoverflow.com/questions/51873087/unable-to-use-mixins-in-vue-with-typescript
 * usage import Component, { mixins } from 'vue-class-component';
 * class ExtendedClass extends mixins(SubscribeMixin) {
 */
@Component
export default class CreatedAtMixin extends Vue {
  protected firstMintDate = new Date()
  protected lastBoughtDate = new Date()

  get formattedTimeToNow() {
    return this.firstMintDate
      ? formatDistanceToNow(new Date(this.firstMintDate), { addSuffix: true })
      : ''
  }

  get formattedLastBoughtToNow() {
    return this.lastBoughtDate
      ? formatDistanceToNow(new Date(this.lastBoughtDate), { addSuffix: true })
      : ''
  }
}
