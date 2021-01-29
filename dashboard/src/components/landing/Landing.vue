<template>
  <div>
    <section class="hero is-light">
      <div class="hero-body">
        <div class="container">
          <h1 class="title">
            👋 KodaDot NFT explorer<br>
          </h1><br>
          <h2 class="subtitle">
            <a href="https://twitter.com/KodaDot" target="_blank">🖼 NFT Explorer for Kusama</a>
          </h2>

          <h3>👀 <router-link :to="{ name: 'nft' }">
          Browse NFT collectables </router-link></h3><br>
          

          <h3>🖨 <router-link :to="{ name: 'rmrk' }">
          Create your NFT collectables </router-link></h3><br>

          ⚙️ <router-link :to="{ name: 'settings' }">Change your endpoint node</router-link><br> 
          📣 Feedback? <a href="https://github.com/vue-polkadot/apps/issues/new">We'd be happy to discuss it.</a><br>

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
