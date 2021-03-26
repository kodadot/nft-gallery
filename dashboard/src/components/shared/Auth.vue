<template>
  <div class="auth-avatar" v-if="account">
    <Avatar :value="account" :size="24" />
    <b><Identity :address="account" :inline="true"/></b>
  </div>
  <AccountSelect
    v-else
    :label="$i18n.t('Account')"
    v-model="account"
    :tooltipVisible="false"
  />
</template>

<script lang="ts" >
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import shouldUpdate from '@/utils/shouldUpdate';

const components = {
  Avatar: () => import('@/components/shared/Avatar.vue'),
  AccountSelect: () => import('@/components/shared/AccountSelect.vue'),
  Identity: () => import('@/components/shared/format/Identity.vue')
};

@Component({ components })
export default class Auth extends Vue {
  @Prop() public value!: string;

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
</style>
