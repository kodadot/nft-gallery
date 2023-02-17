import { Component, Vue } from 'nuxt-property-decorator'
import { getKusamaAssetId } from '@/utils/api/bsx/query'

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

  get tokenId() {
    return getKusamaAssetId(this.urlPrefix)
  }

  public checkPrefixBeforeMount() {
    const prefix = this.$route.params.prefix

    if (this.urlPrefix !== prefix) {
      this.$store.dispatch('setUrlPrefix', prefix)
      this.$router.go(0)
    }
  }
}
