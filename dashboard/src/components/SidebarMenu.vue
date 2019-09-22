<template>
  <div>
      <div>
    <figure class="image is-48x48">
      <img
        class="is-rounded"
        src="../assets/vue-polkadot.png"
        alt="Lightweight UI components for Vue.js based on Bulma"
      />
    </figure>
    dashboard
    </div>
    <b-menu>
      <b-menu-list>
        <b-menu-item icon="users" label="acc"></b-menu-item>
        <b-menu-item icon="address-book" label="adrbk" disabled></b-menu-item>
        <b-menu-item icon="calendar-check" label="dmcrcy" disabled></b-menu-item>
        <b-menu-item icon="sync" label="xtrnscs" disabled></b-menu-item>
        <b-menu-item icon="paper-plane" label="trnsfr" disabled></b-menu-item>
        <b-menu-item icon="cogs" label="sttngs" disabled></b-menu-item>
      </b-menu-list>
    </b-menu>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class SidebarMenu extends Vue {}
</script>

<style scoped>
.menu {
  /* background-color: #efefef; */
}
</style>