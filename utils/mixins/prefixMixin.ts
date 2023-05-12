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
    return usePrefix().urlPrefix.value
  }

  get client(): string {
    return this.urlPrefix
  }

  get isMoonriver(): boolean {
    return this.urlPrefix === 'movr'
  }

  get tokenId() {
    return getKusamaAssetId(this.urlPrefix)
  }
}
