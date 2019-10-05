<template>
  <div>
      <div>
        <figure class="image is-52x52">
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
        <b-menu-item tag="router-link" to="/" icon="users" label="accnt"></b-menu-item>
        <b-menu-item icon="address-book" label="adrbk" :disabled="hasBasicMode"></b-menu-item>
        <b-menu-item icon="calendar-check" label="dmcrcy" :disabled="hasBasicMode"></b-menu-item>
        <b-menu-item icon="sync" label="xtrnscs" :disabled="hasBasicMode"></b-menu-item>
        <b-menu-item icon="paper-plane" label="trnsfr" :disabled="hasBasicMode"></b-menu-item>
        <b-menu-item label="xplrr" tag="router-link" to="explorer"></b-menu-item>
        <b-menu-item tag="router-link" to="settings" icon="cogs" label="sttngs"></b-menu-item>
      </b-menu-list>
    </b-menu>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class SidebarMenu extends Vue {

  get hasBasicMode() {
    return this.$store.getters.getSettings.uiMode === 'light'
  }
}
</script>

<style scoped>
.menu {
  /* background-color: #efefef; */
}
</style>