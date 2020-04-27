<template>
  <div>
    <section class="hero is-light">
      <div class="hero-body">
        <div class="container">
          <h1 class="title">
            👋 KodaDot<br>
          </h1><br>
          <h2 class="subtitle">
            <a href="https://twitter.com/KodaDot" target="_blank">🏛 Governance dashboard</a>
          </h2>

          🔍 <router-link :to="{ name: 'explorer' }">Explore blocks 🕵️‍♀️</router-link><br>
          📇<router-link :to="{ name: 'accounts' }">
          Create and manage your accounts</router-link>, 
          <router-link :to="{ name: 'addressbook' }">
          add contacts</router-link>.<br>
          📯 <router-link :to="{ name: 'transfer' }">Do transfers between accounts</router-link>.<br>
          🗳<router-link :to="{ name: 'democracy' }">Vote and submit proposals</router-link> on your favourite chain.<br>
          🦠<router-link :to="{ name: 'extrinsics' }">Submit various type of extrinsics</router-link>.<br>
          ⚙️ <router-link :to="{ name: 'settings' }">Change your endpoint node and external explorer preference</router-link>.<br> 
          👩‍🍳 More features will come later as they are being cooked.<br>
          📣 Feedback or Question? <a href="https://github.com/vue-polkadot/apps/issues/new">Submit issue, we'd be happy to discuss.</a><br>
          👩‍🔬 Parachain owner and you want custom module? <a href="https://t.me/yangwao">👋 Reach us on Telegram.</a>
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

<style scoped>
.subtitle {
  text-decoration: underline;
}
</style>
