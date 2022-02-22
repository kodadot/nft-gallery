<template>
  <div>
    <div class="modal-card wallet">
      <header class="modal-card-head">
        <p class="modal-card-title">Connect Wallet</p>
        <button type="button" class="delete" @click="$emit('close')" />
      </header>
      <section class="modal-card-body">
        <div class="has-text-centered">
          <img
            src="~/assets/Koda_Beta.svg"
            alt="First NFT market explorer on Kusama and Polkadot"
            height="32" />
        </div>

        <div class="buttons my-5">
          <b-button size="is-medium" icon-right="chevron-right" expanded
            >Talisman</b-button
          >
          <b-button size="is-medium" icon-right="chevron-right" expanded
            >Polkadot.js</b-button
          >
        </div>
      </section>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'nuxt-property-decorator'
import { supportWallets, Wallet } from '@/utils/config/wallets'

@Component({})
export default class extends Vue {
  @Prop() public templateValue!: undefined
  private templateValue2: undefined
}
</script>

<style lang="scss" scoped>
.wallet {
  border-radius: 10px;
  max-width: 400px;
  .modal-card-head {
    background-color: rgb(44, 45, 48) !important;
    border-bottom: inherit;
  }
  .modal-card-body {
    background-color: rgb(44, 45, 48) !important;
  }
}
</style>
