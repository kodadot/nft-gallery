import { Component, Vue } from 'nuxt-property-decorator'

/*
 * refer to https://stackoverflow.com/questions/51873087/unable-to-use-mixins-in-vue-with-typescript
 * import { Component, Mixins } from 'nuxt-property-decorator';
 * class ExtendedClass extends Mixins(ActualMixin) {
 */
@Component
export default class PrefixMixin extends Vue {
  get urlPrefix() {
    return this.$store.getters.currentUrlPrefix
  }

  get client(): string {
    return this.urlPrefix === 'rmrk' ? 'subsquid' : this.urlPrefix
  }

  get isMoonriver(): boolean {
    return this.urlPrefix === 'movr'
  }
}
