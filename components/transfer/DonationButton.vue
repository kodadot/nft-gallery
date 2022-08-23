<template>
  <b-button
    type="is-bordered-light share-button"
    icon-left="gift"
    @click="goToTransfer">
  </b-button>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'
@Component({})
export default class DonationButton extends Vue {
  @Prop() public address!: string

  public goToTransfer() {
    this.$router.push({
      name: 'transfer',
      query: { target: this.address, usdamount: '10', donation: 'true' },
    })
  }
}
</script>
