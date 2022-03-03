<template>
  <b-button
    type="is-primary"
    class="navbar__button"
    @click="openWalletConnectModal()">
    {{ buttonText }}
  </b-button>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'
import WalletModal from '~/components/common/WalletModal.vue'

@Component({})
export default class extends Vue {
  @Prop({ default: 'Connect' }) public buttonText!: string // i18

  protected openWalletConnectModal(): void {
    this.$buefy.modal.open({
      parent: this,
      component: WalletModal,
      hasModalCard: true,
      trapFocus: true,
    })
  }
}
</script>
