<template>
  <b-navbar 
    fixed-top
    shadow
    spaced
    >
    <template #brand>
      <b-navbar-item tag="router-link" :to="{ path: '/' }">
        <img
          src="../assets/kodadot_logo_v1_transparent_400px.png"
          alt="KodaDot - best NFT explorer on Kusama and Polkadot"
        >
      </b-navbar-item>
    </template>
    <template #start class="start">
      <b-navbar-item
        v-for="row in navbar"
        v-bind:key="row.name"
        :tag="row.tag"
        :to="row.to">
        <strong v-if="row.strong">{{row.name}}</strong>
        <small v-else>{{row.name}}</small>
      </b-navbar-item>
    </template>
    <template #end>
      <b-navbar-item tag="div">
        <div class="buttons">
          <b-button tag="router-link"
            :to="{ name: 'rmrkFaq' }" > 
            F.A.Q. 
          </b-button>
          <a class="button is-info"
            href="https://twitter.com/Kodadot">
              <b-icon 
                pack="fab" 
                icon="twitter">
              </b-icon>
              <strong>KodaDot</strong>
          </a>
        </div>
      </b-navbar-item>
    </template>
  </b-navbar>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { getCurrentColor } from '@/colors'

@Component({})
export default class NavbarMenu extends Vue {
  private color: string = getCurrentColor()
  public navbar: any = [
    {
      name: 'Create',
      tag: 'router-link',
      to: { name: 'rmrk' },
      strong: true
    },
    {
      name: 'Credit',
      icon: 'users',
      to: { name: 'rmrkCredit' },
      tag: 'router-link',
      strong: true
    },
    {
      name: 'Gallery',
      tag: 'router-link',
      to: { name: 'nft' },
      strong: true
    },

    {
      name: 'Accounts',
      icon: 'users',
      to: { name: 'accounts' },
      tag: 'router-link',
    },

    {
      name: 'Transfer',
      icon: 'paper-plane',
      to: { name: 'transfer' },
      tag: 'router-link',
    },
    {
      name: 'Settings',
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
<style>
/* .navbar-brand {
  padding-left: 8rem;
} */
.navbar-start {
  padding-left: 8rem;
}
.navbar-end {
  padding-right: 8rem;
}
</style>
