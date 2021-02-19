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
          <div class="tile is-ancestor">
            <div class="tile is-parent is-vertical">
              <div class="tile is-child">
                <h2 class="title is-3">
                  <router-link :to="{ name: 'nft' }">
                    <b-icon  
                      icon="eye">
                    </b-icon> 
                    {{ $t('Gallery of NFT Tokens and Collectibles') }}
                  </router-link>
                </h2>
                <h2 class="subtitle is-4">
                  <router-link :to="{ name: 'rmrk' }">
                    <b-icon  
                      icon="print">
                    </b-icon>
                    {{ $t('Create your NFT Token & Collectibles') }}
                  </router-link>
                </h2><br>
              </div>
              <div class="tile is-child">
                <h2 class="title is-4">
                  <router-link :to="{ name: 'rmrkFaq' }">
                    <b-icon  
                      icon="question">
                    </b-icon> 
                    {{ $t('New here? We have F.A.Q.') }}
                  </router-link>
                </h2>
                <h2 class="subtitle is-4">
                  <a href="https://github.com/kodadot/nft-gallery/issues/new" target="_blank">
                    <b-icon 
                      pack="far"
                      icon="comment-dots">
                    </b-icon>
                    {{ $t('Feedback? We\\\'d be happy to discuss it.') }}
                  </a>
                </h2><br>
              </div>
            </div>
              <div class="tile is-parent is-vertical">
                <div class="tile is-child">
                  <h2 class="title is-3">
                    <b-icon
                      pack="fab"
                      icon="telegram-plane"
                      size="is-medium"
                    ></b-icon>
                      Community
                  </h2>
                  <h2 class="subtitle is-4">
                    <li 
                      v-for="community in publicCommunity"
                      :key="community[0]">
                        <a :href="community[1]">{{ community[0] }}</a>
                      </li>
                  </h2>
                </div>
                <div class="tile is-child">
                  <h2 class="title">
                    <a href="https://twitter.com/KodaDot" target="_blank">
                      <b-icon 
                        pack="fab" 
                        icon="twitter">
                      </b-icon> 
                      KodaDot
                    </a>
                  </h2>
                  <h2 class="subtitle">
                    <a href="https://medium.com/kodadot/kodadot-nft-explorer-f2c3a326a856" target="_blank">
                      <b-icon 
                        pack="fab" 
                        icon="medium">
                      </b-icon>   
                      {{ $t('Read our story, how we started.') }}
                    </a>
                  </h2>
                </div>
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
  public publicCommunity: any = [
    ['Poland', 'https://t.me/joinchat/HG7J2RAk906N7scb'],
    ['Spanish','https://t.me/joinchat/HkF3cxImJAJGoRH9'],
    ['Vietnamese', 'https://t.me/joinchat/GR0OiagewrkTzD4u']
  ]
}
</script>

<style scoped>
.subtitle {
  text-decoration: underline;
}

li {
  list-style-type: square;
}
</style>
