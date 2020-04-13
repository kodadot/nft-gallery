<template>
  <div class="Landing">
    <section class="hero is-light">
      <div class="hero-body">
        <div class="container">
          <h1 class="title">
            👋 Welcome to KodaDot<br>
            🏛 Governance dashboard
          </h1><br>
          <h2 class="subtitle">
            <a href="https://twitter.com/KodaDot" target="_blank">🐦 Feel free to follow us on Twitter @KodaDot</a>
          </h2>

          📇 You can <router-link :to="{ name: 'accounts' }">
          create and manage your accounts</router-link>, 
          <router-link :to="{ name: 'addressbook' }">
          add contacts</router-link>.<br>

          📯 You can <router-link :to="{ name: 'transfer' }">do transfers between accounts</router-link>.<br>

          🗳 You can <router-link :to="{ name: 'democracy' }"> vote and submit proposals</router-link> on your favourite chain.<br>

          👩‍🔬 You can <router-link :to="{ name: 'extrinsics' }">submit various type of extrinsics</router-link>.<br>

          ⚙️ <router-link :to="{ name: 'settings' }">Change your node and appearence</router-link>.<br> 

          🔍 More features will come later as they are being 👩‍🍳cooked.<br>

          📣 Do you have feedback or question? <a href="https://github.com/vue-polkadot/apps/issues/new">Submit issue, we'd be happy to discuss.</a>
        </div>
      </div>
    </section>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';

@Component({})
export default class Landing extends Vue {

  public async mounted() {
    this.$store.commit('setExplorer',{provider: 'subscan', chain: 'kusama'})
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.subtitle {
  text-decoration: underline;
}
</style>
