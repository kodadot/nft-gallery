<template>
  <div class="auth-avatar" v-if="account">
    <Avatar :value="account" :size="size" />
    <span class="subtitle has-text-weight-bold auth-avatar-title" ><Identity :address="account" :inline="true"/></span>
  </div>
  <AccountSelect
    v-else
    :label="$i18n.t('Account')"
    v-model="account"
    :tooltipVisible="false"
  />
</template>

<script lang="ts" >
import { Component, Vue, Prop } from 'vue-property-decorator';

const components = {
  Avatar: () => import('@/components/shared/Avatar.vue'),
  AccountSelect: () => import('@/components/shared/AccountSelect.vue'),
  Identity: () => import('@/components/shared/format/Identity.vue')
};

@Component({ components })
export default class Auth extends Vue {
  @Prop({ default: 24 }) public size!: number;

  public mounted() {
    if (this.account) {
      this.$emit('input', this.account);
    }
  }

  set account(account: string) {
    console.log('setAuth', account);
    this.$store.dispatch('setAuth', { address: account });

  }

  get account() {
    return this.$store.getters.getAuthAddress;
  }
}
</script>

<style scoped>
.auth-avatar {
  display: flex;
  flex-direction: row;
}

.auth-avatar-title {
  padding-left: 0.3em;
}
</style>
