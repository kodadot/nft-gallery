<template>
  <NeoButton
    :label="$t(`${label}`)"
    :variant="variant"
    :no-shadow="noShadow"
    @click.native="toggleWalletConnectModal" />
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'
import { NeoButton, NeoButtonVariant } from '@kodadot1/brick'
import { ConnectWalletModalConfig } from '../common/ConnectWallet/useConnectWallet'
import { isMobileDevice } from '@/utils/extension'

@Component({
  components: { NeoButton },
})
export default class ConnectWalletButton extends Vue {
  @Prop({ default: 'general.connect' }) public label!: string // i18
  @Prop({ default: 'primary' }) public variant!: NeoButtonVariant
  @Prop({ default: false }) public noShadow!: boolean
  @Prop({ default: false }) public modalToggleDisabled!: boolean
  private modal: { close: () => void; isActive?: boolean } | null = null
  private isMobile = ref(window.innerWidth < 1024)

  public toggleWalletConnectModal(): void {
    if (this.isMobile) {
      this.$emit('closeBurgerMenu')
    } else {
      this.$emit('toggleConnectModal')
    }
    if (!this.modalToggleDisabled) {
      if (this.modal?.isActive) {
        this.modal.close()
        this.modal = null
        return
      }
      this.modal = this.$buefy.modal.open({
        parent: this,
        ...ConnectWalletModalConfig,
      })
    }
  }
}
</script>
