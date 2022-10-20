<template>
  <div>
    <DisabledInput
      label="Address Prefix"
      :value="loading ? '' : chainProperties.ss58Format.toString()" />
    <DisabledInput
      label="Decimals"
      :value="loading ? '' : chainProperties.tokenDecimals.toString()" />
    <DisabledInput
      label="Unit"
      :value="loading ? '' : chainProperties.tokenSymbol.toString()" />
    <DisabledInput
      v-if="chainProperties.blockExplorer"
      label="Block Explorer"
      :value="loading ? '' : chainProperties.blockExplorer?.toString()" />
    <DisabledInput
      v-if="chainProperties.genesisHash"
      label="Genesis Hash"
      :value="loading ? '' : chainProperties.genesisHash?.toString()" />
    <b-progress v-if="loading" size="is-large" type="is-primary" show-value>
      Connecting
    </b-progress>
  </div>
</template>

<script lang="ts">
import { Component, Watch, mixins } from 'nuxt-property-decorator'
import DisabledInput from '@/components/shared/DisabledInput.vue'
import ChainMixin from '@/utils/mixins/chainMixin'

@Component({
  components: {
    DisabledInput,
  },
})
export default class Summary extends mixins(ChainMixin) {
  public loading = false

  @Watch('$store.state.loading')
  public mapLoading(): void {
    this.loading = this.$store.state.loading
  }
}
</script>
