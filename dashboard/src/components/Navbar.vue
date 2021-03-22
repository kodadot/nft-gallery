<template>
  <b-navbar
    fixed-top
    shadow
    spaced
    wrapper-class="container"
    :close-on-click="false"
    >
    <template #brand>
      <b-navbar-item tag="router-link" :to="{ path: '/' }">
        <img
          src="@/assets/kodadot_logo_v1_transparent_400px.png"
          alt="First NFT market explorer on Kusama and Polkadot"
        >
      </b-navbar-item>
    </template>
    <template #start class="start">
      <b-navbar-item
        tag="router-link"
        :to="{ name: 'rmrk'}">
        <strong>{{ $t('Create') }}</strong>
      </b-navbar-item>
      <b-navbar-item
        tag="router-link"
        :to="{ name: 'nft'}">
        <strong>{{ $t('Gallery') }}</strong>
      </b-navbar-item>
      <b-navbar-dropdown
          arrowless
          collapsible
          label="Extra">
          <b-navbar-item
            tag="router-link"
            :to="{ name: 'rmrkCredit' }">
            {{ $t('Credit') }}
          </b-navbar-item>
          <b-navbar-item
            tag="router-link"
            :to="{ name: 'settings'}">
            {{ $t('Settings') }}
          </b-navbar-item>
      </b-navbar-dropdown>
      <!-- translations does not resolve in this,
          but it works in FAQ -->
      <!-- <b-navbar-item
        v-for="row in navbar"
        v-bind:key="row.name"
        :tag="row.tag"
        :to="row.to">
        <strong v-if="row.strong">{{row.name}}</strong>
        <small v-else>{{row.name}}</small>
      </b-navbar-item> -->
      <!-- <b-navbar-dropdown
          arrowless
          collapsible
          label="Extra">
          <b-navbar-item
            v-for="row in navbarExtra"
            v-bind:key="row.name"
            :tag="row.tag"
            :to="row.to">
            {{row.name}}
          </b-navbar-item>
      </b-navbar-dropdown> -->
    </template>
    <template #end>
      <b-navbar-item>
        <div class="buttons">
          <b-field grouped>
            <b-button tag="router-link"
              :to="{ name: 'rmrkFaq' }" >
              F.A.Q.
            </b-button>
            <LocaleChanger />
            <b-button tag="a"
              type="is-info" outlined
              href="https://twitter.com/Kodadot">
                <b-icon
                  pack="fab"
                  icon="twitter">
                </b-icon>
                <strong>KodaDot</strong>
            </b-button>
          </b-field>
        </div>
      </b-navbar-item>
    </template>
  </b-navbar>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import LocaleChanger from '@/components/shared/SwitchLocale.vue';
import { getCurrentColor } from '@/colors'
import i18n from '@/i18n.ts';

@Component({
  components: {
    LocaleChanger
  }
})
export default class NavbarMenu extends Vue {
  private color: string = getCurrentColor()
  public navbar: any = [
    // {
    //   name: i18n.t('Create'),
    //   tag: 'router-link',
    //   to: { name: 'rmrk' },
    //   strong: true
    // },
    {
      name: i18n.t('Gallery'),
      tag: 'router-link',
      to: { name: 'nft' },
      strong: true
    },
  ]
  public navbarExtra: any = [
    {
      name: i18n.t('Accounts'),
      icon: 'users',
      to: { name: 'accounts' },
      tag: 'router-link',
    },
    {
      name: i18n.t('Credit'),
      icon: 'users',
      to: { name: 'rmrkCredit' },
      tag: 'router-link',
      strong: true
    },
    {
      name: i18n.t('Transfer'),
      icon: 'paper-plane',
      to: { name: 'transfer' },
      tag: 'router-link',
    },
    {
      name: i18n.t('Settings'),
      icon: 'cogs',
      tag: 'router-link',
      to: { name: 'settings' },
    },
  ]
  private navbarExternal: any = [
    {
      name: 'Twitter',
      tag: 'a',
      href: 'https://twitter.com/Kodadot'
    }
  ]

  // get chainColor() {
  //   return {
  //     'border-bottom': `4px ${this.color} solid`
  //   }
  // }
}
</script>
