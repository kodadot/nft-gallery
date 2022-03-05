<template>
  <div v-if="account">
    <div class="auth-avatar">
      <Avatar :value="account" :size="size" />
      <span class="subtitle has-text-weight-bold auth-avatar-title"
        ><Identity :address="account" :inline="true" hideIdentityPopover
      /></span>
    </div>
  </div>
  <AccountSelect
    v-else
    v-model="account"
    :label="$t('Account')"
    :tooltip-visible="false" />
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'

const components = {
  Avatar: () => import('@/components/shared/Avatar.vue'),
  AccountSelect: () => import('@/components/shared/AccountSelect.vue'),
  Identity: () => import('@/components/shared/format/Identity.vue'),
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

  set account(account: string) {
    this.$store.dispatch('setAuth', { address: account })
  }

  get account() {
    return this.$store.getters.getAuthAddress
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
