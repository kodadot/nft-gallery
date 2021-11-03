<template>
  <div>
    <b-field label="Convert following address">
      <b-input v-model="address" />
    </b-field>
    <DisabledInput
      label="hex input data"
      :value="isHexAddress"
    />
    <b-field
      label="ETH address in Substrate"
      grouped
    >
      <b-input
        class="toolbox-covert__eth-wrapper"
        placeholder="Substrate address"
        :value="convertedAddress"
        disabled
      />
      <p class="control">
        <b-button
          v-clipboard:copy="convertedAddress"
          icon-left="copy"
          @click="toast('Hash has been copied')"
        />
      </p>
    </b-field>
  </div>
</template>

<script lang="ts" >
import { Component, Vue, Watch } from 'nuxt-property-decorator'
import DisabledInput from '@/components/shared/DisabledInput.vue'
import { blake2AsU8a } from '@polkadot/util-crypto/blake2'
import { encodeAddress } from '@polkadot/keyring'
import { stringToU8a, u8aConcat, hexToU8a, isHex } from '@polkadot/util'

const components = {
  DisabledInput
}

@Component({ components })
export default class extends Vue {
  private address = '';
  private convertedAddress = '';

  private mounted() {
    if (this.$route.params.data) {
      this.address = this.$route.params.data
      this.handleAddressWatch(this.$route.params.data)
    }
  }

  @Watch('address')
  private handleAddressWatch(value: string) {
    this.convertedAddress = isHex(value) ? this.convertAddress(value) : ''
  }

  private convertAddress(input: string): string {
    const addr = hexToU8a(input)
    const data = stringToU8a('evm:')
    const res = blake2AsU8a(u8aConcat(data, addr))
    return encodeAddress(res)
  }

  get isHexAddress() {
    return isHex(this.address) ? 'Yes' : 'No'
  }
}
</script>

<style scoped>
.toolbox-covert__eth-wrapper {
  flex-grow: 1;
}
</style>
