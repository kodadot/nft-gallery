import { Component, mixins } from 'nuxt-property-decorator'
import { getChainEndpointByPrefix } from '@/utils/chain'
import PrefixMixin from '@/utils/mixins/prefixMixin'
import { DEFAULT_PREFIX } from '@kodadot1/static'

/*
 * refer to https://stackoverflow.com/questions/51873087/unable-to-use-mixins-in-vue-with-typescript
 * import { Component, Mixins } from 'nuxt-property-decorator';
 * class ExtendedClass extends Mixins(ActualMixin) {
 */
@Component
export default class ApiUrlMixin extends mixins(PrefixMixin) {
  get apiUrl() {
    const endpoint: string =
      getChainEndpointByPrefix(this.urlPrefix) ||
      getChainEndpointByPrefix(DEFAULT_PREFIX) ||
      ''
    return endpoint
  }
}
