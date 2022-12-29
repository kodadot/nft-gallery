<template>
  <b-button @click="toggleWalletConnectModal">
    {{ $t(label) }}
  </b-button>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'
import WalletModal from '~/components/common/WalletModal.vue'

@Component({})
export default class ConnectWalletButton extends Vue {
  @Prop({ default: 'general.connect' }) public label!: string // i18
  private modal: { close: () => void; isActive?: boolean } | null = null

  public toggleWalletConnectModal(): void {
    if (this.modal?.isActive) {
      this.modal.close()
      this.modal = null
      return
    }
    this.modal = this.$buefy.modal.open({
      parent: this,
      component: WalletModal,
      hasModalCard: true,
      trapFocus: true,
    })

    this.$emit('closeBurgerMenu')
  }
}
</script>
