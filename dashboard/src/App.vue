<template>
  <div id="dashboard">
    <img height="200px" src="./assets/vue-polkadot.png">
    <Accounts/>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Accounts from './components/Accounts.vue';

@Component({
  components: {
    Accounts,
  },
})
export default class Dashboard extends Vue {}
</script>

<style>
</style>
