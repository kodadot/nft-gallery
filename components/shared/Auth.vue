<template>
  <div v-if="account">
    <div class="auth-avatar">
      <Avatar :value="account" :size="size" />
      <span class="subtitle has-text-weight-bold auth-avatar-title">
        <Identity :address="account" hide-identity-popover />
      </span>
    </div>
  </div>
  <ConnectWalletButton v-else label="general.connect_wallet" />
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'
import { useIdentityStore } from '@/stores/identity'

const components = {
  Avatar: () => import('@/components/shared/Avatar.vue'),
  ConnectWalletButton: () =>
    import('@/components/shared/ConnectWalletButton.vue'),
  Identity: () => import('@/components/identity/IdentityIndex.vue'),
  Money: () => import('@/components/shared/format/Money.vue'),
}

@Component({ components })
export default class Auth extends Vue {
  @Prop({ default: 24 }) public size!: number

  public mounted() {
    if (this.account) {
      this.$emit('input', this.account)
    }
  }

  get identityStore() {
    return useIdentityStore()
  }

  set account(account: string) {
    this.identityStore.setAuth({ address: account })
  }

  get account() {
    return this.identityStore.getAuthAddress
  }
}
</script>

<style scoped>
.auth-avatar {
  display: flex;
  flex-direction: row;
  margin-bottom: 1rem;
}

.auth-avatar-title {
  padding-left: 0.3em;
}
</style>
