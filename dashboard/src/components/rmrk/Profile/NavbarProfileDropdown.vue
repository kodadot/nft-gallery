<template>
  <b-dropdown
    v-model="navigation"
    position="is-bottom-left"
    append-to-body
    aria-role="menu"
  >
    <template #trigger>
      <Avatar />
    </template>

    <b-dropdown-item custom aria-role="menuitem">
      Logged as <b>Rafael Beraldo</b>
    </b-dropdown-item>
    <hr class="dropdown-divider" />
    <b-dropdown-item has-link aria-role="menuitem">
      <a href="https://google.com" target="_blank">
        <b-icon icon="link"></b-icon>
        Google (link)
      </a>
    </b-dropdown-item>
    <b-dropdown-item value="home" aria-role="menuitem">
      <b-icon icon="home"></b-icon>
      Home
    </b-dropdown-item>
    <b-dropdown-item value="products" aria-role="menuitem">
      <b-icon icon="cart"></b-icon>
      Products
    </b-dropdown-item>
    <b-dropdown-item value="blog" disabled aria-role="menuitem">
      <b-icon icon="book-open"></b-icon>
      Blog
    </b-dropdown-item>
    <hr class="dropdown-divider" aria-role="menuitem" />
    <b-dropdown-item value="settings">
      <b-icon icon="settings"></b-icon>
      Settings
    </b-dropdown-item>
    <b-dropdown-item custom aria-role="menuitem">
        <b-switch v-model="changeAccount"
          :rounded="false">
          Change Account
        </b-switch>
        <AccountSelect v-if="changeAccount" :label="$i18n.t('Account')" @input="selectAccount" />
    </b-dropdown-item>
  </b-dropdown>
</template>

<script lang="ts" >
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import Avatar from '@/components/shared/Avatar.vue'

const components = { Avatar }

@Component({ components })
export default class extends Vue {
  @Prop() public value!: any;
  protected changeAccount: boolean = false;

  protected selectAccount(account: string) {
    this.$store.dispatch('setAuth', { address: account });
  }
}
</script>
