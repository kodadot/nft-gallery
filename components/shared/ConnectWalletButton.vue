<template>
  <NeoButton
    :label="$t(`${label}`)"
    variant="k-accent"
    :no-shadow="noShadow"
    @click.native="toggleWalletConnectModal" />
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'
import WalletModal from '~/components/common/WalletModal.vue'
import { NeoButton } from '@kodadot1/brick'

@Component({
  components: { NeoButton },
})
export default class ConnectWalletButton extends Vue {
  @Prop({ default: 'general.connect' }) public label!: string // i18
  @Prop({ default: false }) public noShadow!: boolean
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
