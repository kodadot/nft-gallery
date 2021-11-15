<template>
  <b-button
    type="is-primary"
    icon-left="gift"
    @click="goToTransfer"
  >
  </b-button>
</template>


<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'
@Component({})
export default class DonationButton extends Vue {
  @Prop() public address!: string;

  public goToTransfer() {
    this.$router.push({
      name: 'transfer',
      query: { target: this.address, usdamount: '10', donation: 'true' }
    })
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/variables";

</style>
