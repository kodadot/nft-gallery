import { Component, Vue } from 'nuxt-property-decorator'
import { useAssetsStore } from '@/stores/assets'

/*
 * refer to https://stackoverflow.com/questions/51873087/unable-to-use-mixins-in-vue-with-typescript
 * import { Component, Mixins } from 'nuxt-property-decorator';
 * class ExtendedClass extends Mixins(ActualMixin) {
 */
@Component
export default class AssetMixin extends Vue {
  get assetsStore() {
    return useAssetsStore()
  }

  assetIdOf(id: string | number) {
    return this.assetsStore.getAssetById(String(id))
  }
}
