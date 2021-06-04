<template>
  <section class="hero is-dark homepage">
    <div class="hero-body">
      <div class="container">
        <h1 class="title is-1 homepage__title">
          <span class="text__stroked">Koda</span>
          <span>Dot</span>
        </h1>
        <h2 class="title is-1 is-flex is-flex-direction-column uppercase homepage__heading">
          <span>
            Carbon neutral
          </span>
          <span class="text__stroked">
            Kusama native
          </span>
          <span>
            NFT plaftorm
          </span>
          <span class="title is-6 homepage__subtitle uppercase text-semibold">
            Built on
            <span class="text-bold text-primary">
              RMRK Protocol
            </span>
          </span>
        </h2>
        <div class="buttons">
          <b-button
              tag="router-link"
              to="/create"
              type="is-primary"
          >
            Create
          </b-button>
          <b-button
              tag="router-link"
              to="/rmrk/gallery"
              type="is-primary"
          >
            Gallery
          </b-button>
          <b-button
              tag="a"
              href="https://medium.com/kodadot/kodadot-nft-explorer-f2c3a326a856"
              target="_blank"
              rel="noopener noreferrer"
              type="is-primary"
          >
            About
          </b-button>
          <b-button
              tag="router-link"
              to="/rmrk/faq"
              type="is-primary"
          >
            Faq
          </b-button>
        </div>
        <div class="homepage__box">
          <div class="homepage__box-content">
            <p>
              Would you like to get featured on our gallery page? Perhaps you have a business proposal in mind. Maybe you would like to be an ambassador. Go to this section for all of the above.
            </p>
            <b-button
              tag="router-link"
              to="/faq"
              type="is-primary"
            >
              Partnership & Ambassador Program
            </b-button>
            <div>
              <p>
                <span>
                  Would you like to know how our journey started?
                </span>
                <span>
                  If so, visit the About section.
                </span>
              </p>
              <p>
                <span>
                  Struggling with KodaDot?
                </span>
                <span>
                  Head over to our FAQ page.
                </span>
              </p>
              <p>
                <span>
                  Found issue? Have Feedback?
                </span>
                <span>
                  Create issue on our GitHub.
                </span>
              </p>
            </div>
          </div>
          <b-button
            tag="a"
            href="https://github.com/kodadot"
            target="_blank"
            rel="noopener noreferrer"
            type="is-primary"
          >
            Kodadot Github
          </b-button>
        </div>
        <!-- <div class="tile is-ancestor">
          <div class="tile is-parent is-vertical">
            <div class="tile is-child">
              <h2 class="title is-3">
                <b-icon
                  pack="fas"
                  icon="camera-retro">
                </b-icon>
                  <router-link :to="{ name: 'nftRare', }">
                    Rare solo feed
                  </router-link>
              </h2>
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
                      <Identity :address="c" :inline="true" />
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
              <h2 class="title is-4">
                <a href="https://nft.kodadot.xyz/rmrk/collection/10D77F8B699437BB50-KODA" target="_blank">
                  <b-icon
                    pack="far"
                    icon="comment-dots">
                  </b-icon>
                  {{ $t('Tutorial: How to mint NFT') }}
                </a>
              </h2>
              <h2 class="title is-4">
                <a href="https://stakenode.medium.com/dont-panic-and-mint-your-nft-s-on-kodadot-kusama-polkadot-first-nft-explorer-4273f789e585" target="_blank">
                  <b-icon
                    pack="far"
                    icon="comment-dots">
                  </b-icon>
                  {{ $t('Tutorial: Mint your NFTs on KodaDot') }}
                </a>
              </h2>
              <h2 class="title is-4">
                <router-link :to="{ name: 'rmrkFaq' }">
                  <b-icon
                    icon="question">
                  </b-icon>
                  {{ $t('New here? We have F.A.Q.') }}
                </router-link>
              </h2>
            </div>
          </div>
            <div class="tile is-parent is-vertical">
              <div class="tile is-child">
                <h2 class="title">
                  <b-icon icon="flask"></b-icon>
                  We are wandering new avenues of NFT experience.
                </h2>
                <h2 class="title">
                  <b-icon icon="leaf"></b-icon>
                  <router-link :to="{ name: 'carbonless'}">
                    Carbonless NFT movement
                  </router-link>
                </h2>
                <h2 class="title">
                  <b-icon icon="leaf"></b-icon>
                  <router-link :to="{ name: 'sustainability'}">
                    Sustainability program
                  </router-link>
                </h2>
                <h2 class="title">
                  <b-icon icon="leaf"></b-icon>
                  <router-link :to="{ name: 'esSustainability'}">
                    Sustentabilidad de KodaDot
                  </router-link>
                </h2>
              </div>
            <div class="tile is-child">
              <h2 class="title">
                <a href="https://t.me/kodadot" target="_blank">
                  <b-icon
                    pack="fab"
                    icon="telegram">
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
                <a href="https://twitter.com/KodaDot" target="_blank">
                  <b-icon
                    pack="fab"
                    icon="twitter">
                  </b-icon>
                  @KodaDot
                </a>
              </h2>
              <h2 class="title">
                <a href="https://discord.gg/u6ymnbz4PR" target="_blank">
                  <b-icon
                    pack="fab"
                    icon="discord">
                  </b-icon>
                  KodaDot Community Discord
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
              <h2 class="title">
                <a href="https://medium.com/kodadot/client-first-nft-gallery-technical-examination-33db09dfdc97" target="_blank">
                  <b-icon
                    pack="fab"
                    icon="medium">
                  </b-icon>
                  {{ $t('Client-first NFT gallery: Technical examination') }}
                </a>
              </h2>
              <h2 class="title">
                <a href="https://twitter.com/metaprime_net" target="_blank">
                  <b-icon
                    pack="fab"
                    icon="twitter">
                  </b-icon>
                  {{ $t('NFT-focused infrastracture @Metaprime_net') }}
                </a>
              </h2>
              </div>
            </div>
        </div> -->
      </div>
    </div>
  </section>
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import gql from 'graphql-tag'

const components = {
  Identity: () => import('@/components/shared/format/Identity.vue'),
};
@Component<Landing>({
  metaInfo() {
    return {
      meta: [
        { property: 'og:title', content: 'KodaDot - Kusama NFT Market explorer'},
        { property: 'og:image', content: 'https://nft.kodadot.xyz/kodadot_carbonless.jpg'},
        { property: 'og:description', content: 'Low carbon NFT gallery on Kusama'},
        { property: 'twitter:title', content: 'KodaDot - Kusama NFT Market Explorer' },
        { property: 'twitter:description', content: 'Low carbon NFT gallery on Kusama'},
        { property: 'twitter:image', content: 'https://nft.kodadot.xyz/kodadot_carbonless.jpg'},
      ]
    }
  },
  components,
  apollo: {
    count: {
      query: gql`query listed {
      collectionEntities {
        totalCount
	    }
    }`,
    update: data => data.collectionEntities.totalCount
    }
  }
})
export default class Landing extends Vue {

  public publicCommunity: any = [
    ['🇦🇲 Armenia', 'https://t.me/kodadotarmenia'],
    // ['🇧🇩 Bengali', 'https://t.me/KodaDot_Bengali'], seems not active
    ['🇨🇿 Česko', 'https://t.me/joinchat/Fhnvbi5a_wRjNzFk'],
    ['🇯🇵 Japan', 'https://t.me/kodadotjapan'],
    ['🇵🇱 Polska', 'https://t.me/joinchat/HG7J2RAk906N7scb'],
    ['🇵🇹 Portuguese', 'https://t.me/joinchat/1UHYFZpVYmE1OTZk'],
    ['🇷🇺 Russia', 'https://t.me/kodadotru'],
    ['🇪🇸 Spanish','https://t.me/joinchat/HkF3cxImJAJGoRH9'],
    ['🇹🇷 Türkiye', 'https://t.me/KodaDotTR'],
    ['🌐 Global KodaDot Discord', 'https://discord.gg/u6ymnbz4PR'],
    ['🏗 Developers', 'https://discord.gg/KkctBVQ8kP'],
    // ['🇻🇳 Việt Nam', 'https://t.me/joinchat/GR0OiagewrkTzD4u'], seems not active
    ['Want to help translate?', 'https://github.com/kodadot/nft-gallery/tree/i18n/dashboard/src/locales']
  ]

  public creators: any = [
    'Dx6nVUy6f2znn4ZwNZ3TGbEyUz3FLbCRGQGKAut4LxjCVRs',
    'J6mwrrDE5ZywDe8T4mWgsdgHCcrDcrVtoGh37i7PSaZARRs',
    'FqCJeGcPidYSsvvmT17fHVaYdE2nXMYgPsBn3CP9gugvZR5',
    'DmUVjSi8id22vcH26btyVsVq39p8EVPiepdBEYhzoLL8Qby',
    'CxQJNQeowRUJBgUHQpspudWy4BU6Rk2u93yDZEKe6GzcLDe',
    'GHuTwhh9txr69tHBM2f1mPE6tWn9XCYKMi3nRNFrYvGv9Yy',
    'CuHWHNcBt3ASMVSJmcJyiBWGxxiWLyjYoYbGjfhL4ovoeSd',
    // 'HtRTwHSP6fYC5PtCsJ7pG4H1hwyPhzXbtVTTVRJ6kvfPFe1', did not set identity
    // 'Cu7QaEnRGPE91WvLduzUii2ZNa3jhMWtmB8SYwumycNRmoN' did not set identity
  ]

}
</script>

<style lang="scss" scoped>
@import '@/styles/colors';

.homepage {
  content: '';
  width: 100%;
  height: 100%;
  background: url('../../assets/homepage-bg.png') center bottom;
  background-repeat: no-repeat;
  background-size: contain;

  &__title {
    display: inline-flex;
    padding: 16px 32px;
    margin: 0 0 60px;
    text-transform: uppercase;
    border: 4px solid $primary;
  }

  &__heading {
    font-size: 4rem;
  }

  &__box {
    max-width: 600px;
    padding: 40px 48px;
    margin: 120px 0 132px;
    background-color: $scheme-main;
    border: 4px solid $primary;
    border-radius: 0;
    box-shadow: 28px -28px $black, 28px -28px 0 4px $primary;
  }

  &__box-content {
    max-width: 464px;

    p, .button {
      margin-bottom: 32px;
    }

    p {
      display: flex;
      flex-direction: column;
    }
  }
}

.text {
  &__stroked {
    color: $primary;
    -webkit-text-fill-color: $black;
    -webkit-text-stroke-width: 2px;
    -webkit-text-stroke-color: $primary;
    padding: 0 8px 0 0;
  }
}

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
