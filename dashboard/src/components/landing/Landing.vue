<template>
  <div>
    <section class="hero is-light">
      <div class="hero-body">
        <div class="container">
          <h1 class="title is-1">
            👋 KodaDot NFT Explorer<br>
          </h1><br>
          <div class="columns">
            <div class="column">
              <h2 class="title is-3">
              🛍️👀 <router-link :to="{ name: 'nft' }">
              Browse & Shop NFT collectables</router-link></h2><br>
              
              <h2 class="title is-4">
              🖨 <router-link :to="{ name: 'rmrk' }">
              Create your NFT collectables</router-link></h2><br>
            </div>
            <div class="column">
              <h2 class="title is-4">
              🆕 <router-link :to="{ name: 'rmrkFaq' }">
              New here? We have F.A.Q.!</router-link></h2><br>
              
              <h2 class="title is-4">
              📣 <a href="https://github.com/kodadot/nft-gallery/issues/new" target="_blank">
              Feedback? We'd be happy to discuss it.</a></h2><br>
            </div>
          </div>
          <div class="columns">
            <div class="column">
              <h2 class="title">
                <b-icon 
                    pack="fab" 
                    icon="twitter">
                </b-icon> 
                <a href="https://twitter.com/KodaDot" target="_blank">
                KodaDot</a>
              </h2>
              <h2 class="title">
                <b-icon 
                    pack="fab" 
                    icon="medium">
                </b-icon> 
                <a href="https://medium.com/kodadot/kodadot-nft-explorer-f2c3a326a856" target="_blank">
                  Read our story, how we started.
                </a>
              </h2>
            </div>
            <div class="column">
            </div>
          </div>
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
