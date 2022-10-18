<template>
  <b-button type="is-primary" class="py-2 px-4" @click="openWalletConnectModal">
    {{ $t(label) }}
  </b-button>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'
import WalletModal from '~/components/common/WalletModal.vue'

@Component({})
export default class ConnectWalletButton extends Vue {
  @Prop({ default: 'general.connect' }) public label!: string // i18

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
