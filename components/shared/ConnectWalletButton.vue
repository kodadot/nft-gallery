<template>
  <NeoButton
    :label="$t(`${label}`)"
    :variant="variant"
    :no-shadow="noShadow"
    @click.native="toggleWalletConnectModal" />
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'
import { ConnectWalletModalConfig } from '@/components/common/ConnectWallet/useConnectWallet'
import { NeoButton, NeoButtonVariant } from '@kodadot1/brick'

@Component({
  components: { NeoButton },
})
export default class ConnectWalletButton extends Vue {
  @Prop({ default: 'general.connect' }) public label!: string // i18
  @Prop({ default: 'primary' }) public variant!: NeoButtonVariant
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
      ...ConnectWalletModalConfig,
    })

    this.$emit('closeBurgerMenu')
  }
}
</script>
