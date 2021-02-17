<template>
  <div>
    <section class="hero is-light">
      <div class="hero-body">
        <div class="container">
          <h1 class="title is-1">
            <router-link :to="{ name: 'nft' }">
              <b-icon  
                icon="magic"
                size="is-large">
              </b-icon> 
              KodaDot NFT  {{ $t('Explorer') }}<br>
            </router-link>
          </h1><br>
          <div class="columns">
            <div class="column">
              <h2 class="title is-3">
                <router-link :to="{ name: 'nft' }">
                  <b-icon  
                    icon="eye">
                  </b-icon> 
                  {{ $t('Gallery of NFT Tokens and Collectibles') }}
                </router-link>
              </h2>
              <br>  
              <h2 class="title is-4">
                <router-link :to="{ name: 'rmrk' }">
                  <b-icon  
                    icon="print">
                  </b-icon>
                  {{ $t('Create your NFT Token & Collectibles') }}
                </router-link>
              </h2><br>
            </div>
            <div class="column">
              <h2 class="title is-4">
                <router-link :to="{ name: 'rmrkFaq' }">
                  <b-icon  
                    icon="question">
                  </b-icon> 
                  {{ $t('New here? We have F.A.Q.') }}
                </router-link></h2><br>
              <h2 class="title is-4">
                <a href="https://github.com/kodadot/nft-gallery/issues/new" target="_blank">
                  <b-icon  
                    icon="comment-alt">
                  </b-icon>
                  {{ $t('Feedback? We\\\'d be happy to discuss it.') }}
                </a>
              </h2><br>
            </div>
          </div>
          <div class="columns">
            <div class="column">
              <h2 class="title">
                <a href="https://twitter.com/KodaDot" target="_blank">
                  <b-icon 
                    pack="fab" 
                    icon="twitter">
                  </b-icon> 
                  KodaDot
                </a>
              </h2>
              <h2 class="title">
                <a href="https://medium.com/kodadot/kodadot-nft-explorer-f2c3a326a856" target="_blank">
                  <b-icon 
                    pack="fab" 
                    icon="medium">
                  </b-icon>   
                  {{ $t('Read our story, how we started.') }}
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
}
</script>

<style scoped>
.subtitle {
  text-decoration: underline;
}
</style>
