<template>
  <div>
    <section class="hero is-light">
      <div class="hero-body">
        <div class="container">
          <h1 class="title is-1">
            <router-link :to="{ name: 'nft' }">
              <b-icon
                pack="fab"
                icon="wpexplorer"
                size="is-medium">
              </b-icon>
              KodaDot NFT  {{ $t('Explorer') }}<br>
            </router-link>
          </h1><br>
          <div class="tile is-ancestor">
            <div class="tile is-parent is-vertical">
              <div class="tile is-child">
                <h2 class="title is-3">
                    <b-icon
                      pack="fas"
                      icon="ghost"
                    ></b-icon>
                      Creators Spotlight
                </h2>
                <h2 class="subtitle is-4">
                  <li
                    v-for="c in creators"
                    :key="c">
                      <router-link :to="{ name: 'profile', params: { id: c } }">
                        {{ c | shortAddress }}
                      </router-link>
                    </li>
                </h2>
              </div>
              <div class="tile is-child">
                  <h2 class="title is-3">
                    <b-icon
                      pack="fab"
                      icon="telegram-plane"
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
            </div>
              <div class="tile is-parent is-vertical">
                <div class="tile is-child">
                  <h2 class="title">
                    <b-icon icon="flask"></b-icon>
                    We are wandering new avenues of NFT experience.<br>
                  </h2>
                  <h2 class="title">
                    <b-icon icon="leaf"></b-icon>
                    Low carbon NFT platform running on
                    <a href="https://kusama.network">Kusama.network</a> - NPoS
                  </h2>
                </div>
                <div class="tile is-child">
                  <h2 class="title is-3">
                  <router-link :to="{ name: 'nft' }">
                    <b-icon
                      icon="eye">
                    </b-icon>
                    {{ $t('Gallery of NFT Tokens and Collectibles') }}
                  </router-link>
                </h2>
                <h2 class="title is-4">
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
                <h2 class="title is-4">
                  <a href="https://github.com/kodadot/nft-gallery/issues/new" target="_blank">
                    <b-icon
                      pack="far"
                      icon="comment-dots">
                    </b-icon>
                    {{ $t('Feedback? We\\\'d be happy to discuss it.') }}
                  </a>
                </h2><br>
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
                    <a href="https://www.reddit.com/r/KodaDot/" target="_blank">
                      <b-icon
                        pack="fab"
                        icon="reddit-alien">
                      </b-icon>
                      r/KodaDot
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
                  <h2 class="title">
                    <a href="https://medium.com/kodadot/traverse-to-the-prime-show-733d6046d3f5" target="_blank">
                      <b-icon
                        pack="fab"
                        icon="medium">
                      </b-icon>
                      {{ $t('Traverse to the prime show') }}
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
    ['Bengali', 'https://t.me/KodaDot_Bengali'],
    ['Czech', 'https://t.me/joinchat/Fhnvbi5a_wRjNzFk'],
    ['Japan', 'https://t.me/joinchat/-CjTUgAflGQxYTU0'],
    ['Korea', 'https://t.me/KodaDotKR'],
    ['Portuguese', 'https://t.me/joinchat/1UHYFZpVYmE1OTZk'],
    ['Poland', 'https://t.me/joinchat/HG7J2RAk906N7scb'],
    ['Russia', 'https://t.me/kodadotru'],
    ['Spanish','https://t.me/joinchat/HkF3cxImJAJGoRH9'],
    ['Vietnamese', 'https://t.me/joinchat/GR0OiagewrkTzD4u'],
    ['Want to help translate?', 'https://github.com/kodadot/nft-gallery/tree/i18n/dashboard/src/locales']
  ]

  public creators: any = [
    'HtRTwHSP6fYC5PtCsJ7pG4H1hwyPhzXbtVTTVRJ6kvfPFe1',
    'Dx6nVUy6f2znn4ZwNZ3TGbEyUz3FLbCRGQGKAut4LxjCVRs',
    'J6mwrrDE5ZywDe8T4mWgsdgHCcrDcrVtoGh37i7PSaZARRs',
    'DmUVjSi8id22vcH26btyVsVq39p8EVPiepdBEYhzoLL8Qby',
    'CxQJNQeowRUJBgUHQpspudWy4BU6Rk2u93yDZEKe6GzcLDe',
  ]

}
</script>

<style scoped>
.subtitle {
  text-decoration: underline;
}

.truncate {
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

li {
  list-style-type: square;
}
</style>
