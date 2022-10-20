import { Component, Vue } from 'nuxt-property-decorator'
import { getChainEndpointByPrefix } from '@/utils/chain'

/*
 * refer to https://stackoverflow.com/questions/51873087/unable-to-use-mixins-in-vue-with-typescript
 * import { Component, Mixins } from 'nuxt-property-decorator';
 * class ExtendedClass extends Mixins(ActualMixin) {
 */
@Component
export default class ApiUrlMixin extends Vue {
  get apiUrl() {
    const endpoint = getChainEndpointByPrefix(
      this.$store.getters.currentUrlPrefix
    )
    return endpoint || this.$store.getters.getSettings['apiUrl']
  }
}
