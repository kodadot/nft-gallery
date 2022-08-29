import { Component, Vue } from 'nuxt-property-decorator'
import { TokenProperty } from '~/store/assets'

/*
 * refer to https://stackoverflow.com/questions/51873087/unable-to-use-mixins-in-vue-with-typescript
 * import { Component, Mixins } from 'nuxt-property-decorator';
 * class ExtendedClass extends Mixins(ActualMixin) {
 */
@Component
export default class AssetMixin extends Vue {
  get assetIdOf(): (id: string | number) => TokenProperty {
    return this.$store.getters['assets/getAssetById']
  }
}
