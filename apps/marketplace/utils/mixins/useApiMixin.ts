import { Component } from 'nuxt-property-decorator'
import ApiUrlMixin from './apiUrlMixin'
import type { ApiPromise } from '@polkadot/api'
import { ApiFactory } from '@kodadot1/sub-api'

/*
 * refer to https://stackoverflow.com/questions/51873087/unable-to-use-mixins-in-vue-with-typescript
 * import { Component, Mixins } from 'nuxt-property-decorator';
 * class ExtendedClass extends Mixins(ActualMixin) {
 */
@Component
export default class UseApiMixin extends ApiUrlMixin {
  public useApi(): Promise<ApiPromise> {
    return ApiFactory.useApiInstance(this.apiUrl)
  }
}
