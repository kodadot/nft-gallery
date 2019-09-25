<template>
  <div>
    <div>
      <figure class="image is-52x52">
    <img
      class="is-rounded"
      src="../assets/vue-polkadot.png"
      alt="Lightweight UI components for Vue.js based on Bulma" />
    </figure>
    </div>
    <b-menu>
      <b-menu-list
        v-for="row in sidebar"
        v-bind:key="row.name"
        @click="currentRow = row">
        <b-menu-item 
          :icon="row.icon" 
          :label="row.name"
          :tag="row.tag"
          :to="row.to"
          :disabled="row.disabled">
        </b-menu-item> 
      </b-menu-list>
    </b-menu>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component({})
export default class SidebarMenu extends Vue {
  public sidebar: any = [
    {
      name: 'accounts',
      icon: 'users',
      to: 'accounts',
      tag: 'router-link',
    },
    {
      name: 'address book',
      icon: 'address-book',
      to: 'addressbook',
      tag: 'router-link',
    },
    {
      name: 'transfer',
      icon: 'paper-plane',
      to: 'transfer',
      tag: 'router-link',
    },
    {
      name: 'democracy',
      icon: 'calendar-check',
      to: 'democracy',
      tag: 'router-link',
      disabled: true,
    },
    {
      name: 'extrinsics',
      icon: 'sync',
      to: 'democracy',
      tag: 'router-link',
      disabled: true,
    },
    {
      name: 'settings',
      icon: 'cogs',
      to: 'settings',
      tag: 'router-link',
      disabled: true,
    },
  ];
  public currentRow: any = this.sidebar[0];
}
</script>

<style scoped>
.menu {
  /* background-color: #efefef; */
}
</style>