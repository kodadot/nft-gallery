<template>
  <div id="dashboard">
    
    <div class="friendly-view" >
    <SidebarMenu class="happy-menu" />
    <router-view id='routerview'/>
    </div>
    
    <!-- <img height="200px" src="./assets/vue-polkadot.png"> -->
    <!-- <Accounts/> -->

  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Accounts from './components/Accounts.vue';
import Navbar from './components/Navbar.vue';
import SidebarMenu from './components/SidebarMenu.vue';

@Component({
  components: {
    Accounts,
    Navbar,
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
