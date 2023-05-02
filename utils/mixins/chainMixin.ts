import { Component } from 'nuxt-property-decorator'
import PrefixMixin from './prefixMixin'
import { chainPropListOf } from '@/utils/config/chain.config'
import { ChainProperties } from '../api/Query'
/*
 * refer to https://stackoverflow.com/questions/51873087/unable-to-use-mixins-in-vue-with-typescript
 * usage import Component, { mixins } from 'vue-class-component';
 * class ExtendedClass extends mixins(SubscribeMixin) {
 */
@Component
export default class ChainMixin extends PrefixMixin {
  get urlPrefix() {
    return usePrefix().urlPrefix.value
  }

  get chainProperties(): ChainProperties {
    return chainPropListOf(this.urlPrefix)
  }

  get decimals(): number {
    return this.chainProperties.tokenDecimals
  }

  get unit(): string {
    return this.chainProperties.tokenSymbol
  }

  get blockExplorer(): string {
    return this.chainProperties.blockExplorer ?? 'https://kusama.subscan.io/'
  }
}
