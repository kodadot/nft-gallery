<template>
  <div>
    <DisabledInput
      label="Address Prefix"
      :value="loading ? '' : chainProperties.ss58Format.toString()"
    />
    <DisabledInput
      label="Decimals"
      :value="loading ? '' : chainProperties.tokenDecimals.toString()"
    />
    <DisabledInput
      label="Unit"
      :value="loading ? '' : chainProperties.tokenSymbol.toString()"
    />
    <DisabledInput
      label="Genesis Hash"
      :value="loading ? '' : chainProperties.genesisHash.toString()"
    />
    <b-progress
      v-if="loading"
      size="is-large"
      type="is-primary"
      show-value
    >
      Connecting
    </b-progress>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'nuxt-property-decorator'
import DisabledInput from '@/components/shared/DisabledInput.vue'

@Component({
  components: {
    DisabledInput
  },
})
export default class Summary extends Vue {
  public loading = false;

  get chainProperties() {
    return this.$store.getters['chain/getChainProperties']
  }

  @Watch('$store.state.loading')
  public mapLoading(): void {
    this.loading = this.$store.state.loading
  }

}
</script>
