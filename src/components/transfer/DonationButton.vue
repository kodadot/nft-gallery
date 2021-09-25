<template>
  <b-button
    type="is-primary"
    icon-left="gift"
    outlined
    @click="goToTransfer"
    class="donation-btn"
  >
    {{ $t("Gift 10$") }}
  </b-button>
</template>


<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
@Component({})
export default class DonationButton extends Vue {
  @Prop() public address!: string;

  public goToTransfer() {
    this.$router.push({
      name: 'transfer',
      query: { target: this.address, usdamount: '10', donation: 'true' }
    });
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/variables";

.donation-btn {
  margin-bottom: 1.5rem;
}
</style>
