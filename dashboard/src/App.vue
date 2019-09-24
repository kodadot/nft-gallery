<template>
  <div id="dashboard">
    <div class="friendly-view" >
      <SidebarMenu class="happy-menu" />
      <router-view id='routerview'/>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import SidebarMenu from './components/SidebarMenu.vue';

@Component({
  components: {
    SidebarMenu,
  },
})
export default class Dashboard extends Vue {}
</script>

<style>
  #routerview {
    padding: 1em;
  }

  .friendly-view {
    display: flex;
    flex-direction: row;
  }

  .friendly-view > .happy-menu {
    flex: 2
  }

  .friendly-view #routerview {
    flex: 10;
  }

  .friendly-view {
    height: 100vh;
  }
</style>
