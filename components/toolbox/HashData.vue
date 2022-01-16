<template>
  <div>
    <b-field label="from the following data">
      <b-input
        v-model="data"
        @input="
          isHexData();
          hashData();
        "
      />
    </b-field>
    <DisabledInput label="hex input data" :value="inputDataCheck" />
    <b-field>
      <b-field label="the resulting hash">
        <b-input :value="hashedData" expanded disabled />
        <b-button
          v-clipboard:copy="hashedData"
          size="is-large"
          icon-left="copy"
          @click="toast('Hash has been copied')"
        />
      </b-field>
    </b-field>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator';
import { hexToU8a, isHex, stringToU8a } from '@polkadot/util';
import { blake2AsHex } from '@polkadot/util-crypto';
import DisabledInput from '@/components/shared/DisabledInput.vue';

@Component({
  components: {
    DisabledInput,
  },
})
export default class HashDataMessage extends Vue {
  private data = '';
  private inputDataCheck = 'No';
  private hashedData = '';

  private hashData(): void {
    this.hashedData = blake2AsHex(
      isHex(this.data) ? hexToU8a(this.data) : stringToU8a(this.data),
      256
    );
  }

  private isHexData(): void {
    this.inputDataCheck = isHex(this.data) ? 'Yes' : 'No';
  }

  private toast(message: string): void {
    this.$buefy.toast.open(message);
  }
}
</script>
