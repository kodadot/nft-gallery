<template>
  <b-dropdown position="is-bottom-left" append-to-body aria-role="menu">
    <template #trigger>
      <span v-if="account" class="columns is-mobile is-vcentered navbar-avatar" >
      <Avatar class="navbar-avatar" :value="account" :size="42" />
      <span class="subtitle has-text-weight-bold is-align-self-center"><Identity class="navbar-identity" :address="account" :inline="true"/></span>
      </span>
      <template v-else>
        <b-button type="is-text">Connect</b-button>
      </template>
    </template>

    <template v-if="account">
      <b-dropdown-item has-link aria-role="menuitem">
        <router-link :to="{ name: 'profile', params: { id: account } }">
          <b-icon pack="fas" icon="ghost"></b-icon>
          <b><Identity :address="account" :inline="true"/></b>
        </router-link>
      </b-dropdown-item>
      <hr class="dropdown-divider" />
      <b-dropdown-item has-link aria-role="menuitem">
        <router-link :to="{ name: 'profile', params: { id: account } }">
          Profile
        </router-link>
      </b-dropdown-item>
      <b-dropdown-item has-link aria-role="menuitem">
        <router-link :to="{ name: 'rmrkCredit' }">
          {{ $t("Credit") }}
        </router-link>
      </b-dropdown-item>
      <b-dropdown-item has-link aria-role="menuitem">
        <router-link :to="{ name: 'rmrkFaq' }" >
          F.A.Q.
        </router-link>
      </b-dropdown-item>
      <hr class="dropdown-divider" aria-role="menuitem" />
      <b-dropdown-item has-link aria-role="menuitem">
        <a class="has-text-info" href="https://google.com" target="_blank">
          <b-icon pack="fab" icon="twitter"> </b-icon>
          <strong>KodaDot</strong>
        </a>
      </b-dropdown-item>
    </template>
    <b-dropdown-item custom aria-role="menuitem">
      <b-button @click="changeAccount = !changeAccount" expanded
        >Change account</b-button
      >
    </b-dropdown-item>
    <b-dropdown-item
      v-if="changeAccount || !account"
      custom
      aria-role="menuitem"
    >
      <AccountSelect
        :label="$i18n.t('Account')"
        v-model="account"
        :tooltipVisible="false"
      />
    </b-dropdown-item>
  </b-dropdown>
</template>

<script lang="ts" >
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import Avatar from '@/components/shared/Avatar.vue';

const components = {
  Avatar,
  AccountSelect: () => import('@/components/shared/AccountSelect.vue'),
  Identity: () => import('@/components/shared/format/Identity.vue')
};

@Component({ components })
export default class NavbarProfileDropdown extends Vue {
  @Prop() public value!: any;
  protected changeAccount: boolean = false;

  set account(account: string) {
    console.log('setAuth', account);
    this.$store.dispatch('setAuth', { address: account });
  }

  get account() {
    return this.$store.getters.getAuthAddress;
  }
}
</script>

<style lang="scss" scoped>
@import "bulma/bulma.sass";

.navbar-avatar {
  @include until($desktop) {
    margin-left: 0.5rem;
  }
}

// .navbar-identity {
//   @include from($desktop) {
//     display: none;
//   }
// }
</style>
