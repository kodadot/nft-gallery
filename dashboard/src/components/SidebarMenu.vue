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
    Polkadash
    </div>
    <b-menu>
      <b-menu-list>
        <b-menu-item icon="information-outline" label="Info"></b-menu-item>
        <b-menu-item icon="information-outline" label="Info"></b-menu-item>
        <b-menu-item icon="information-outline" label="Info"></b-menu-item>
        <b-menu-item icon="information-outline" label="Info"></b-menu-item>
        <b-menu-item icon="information-outline" label="Info"></b-menu-item>
        <b-menu-item icon="information-outline" label="Info"></b-menu-item>
        <b-menu-item icon="information-outline" label="Info"></b-menu-item>
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