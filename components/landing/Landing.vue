<template>
  <section class="homepage">
    <section class="section">
      <div class="container">
        <div class="columns">
          <div class="column">
            <h1 class="title is-1 homepage__title">
              <span class="text__stroked">Koda</span>
              <span>Dot</span>
            </h1>
            <h2
              class="
                title
                is-1 is-flex is-flex-direction-column
                uppercase
                homepage__heading
              "
            >
              <span> Carbon neutral </span>
              <span class="text__stroked"> Kusama native </span>
              <span> NFT plaftorm </span>
              <span
                class="title is-6 homepage__subtitle uppercase text-semibold"
              >
                Built on
                <span class="text-bold text-primary"> {{ buildOn }} </span>
              </span>
            </h2>
            <div class="buttons">
              <b-button tag="nuxt-link" :to="`/${prefix}/create`" type="is-primary">
                {{ $t('Create') }}
              </b-button>
              <b-button
                tag="nuxt-link"
                :to="`/${prefix}/collections`"
                type="is-primary"
              >
                Collections
              </b-button>
              <b-button tag="nuxt-link" :to="`/${prefix}/gallery`" type="is-primary">
                Gallery
              </b-button>
              <b-button tag="nuxt-link" to="/spotlight" type="is-primary">
                Spotlight
              </b-button>
              <b-button tag="nuxt-link" to="/series-insight" type="is-primary">
                Series
              </b-button>
              <b-button tag="nuxt-link" to="/about" type="is-primary">
                About
              </b-button>
              <b-button tag="nuxt-link" to="/rmrk/faq" type="is-primary">
                Faq
              </b-button>
              <b-button
                tag="a"
                href="https://tally.so/r/mVP06w"
                target="_blank"
                rel="noopener noreferrer"
                type="is-primary"
              >
                Grants
              </b-button>
              <b-button
                tag="a"
                href="https://en.wikipedia.org/wiki/Non-fungible_token"
                target="_blank"
                rel="noopener noreferrer"
                type="is-primary"
              >
                What are NFTs?
              </b-button>
            </div>
          </div>
          <div class="column has-text-right has-text-left-mobile">
            <iframe
              src="https://discord.com/widget?id=840514076538830888&theme=dark"
              width="350"
              height="500"
              allowtransparency="true"
              frameborder="0"
              sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"
            ></iframe>
          </div>
        </div>

        <div class="homepage__box">
          <div class="homepage__box-content">
            <p>
              Would you like to get featured on our gallery page? Perhaps you
              have a business proposal in mind. Maybe you would like to be an
              ambassador. Go to this section for all of the above.
            </p>
            <b-button
              tag="nuxt-link"
              to="/partnership"
              type="is-primary"
              class="homepage__button--wrapped"
            >
              Partnership & Ambassador Program
            </b-button>
            <div>
              <p>
                <span> Would you like to know how our journey started? </span>
                <span> If so, visit the About section. </span>
              </p>
              <p>
                <span> Struggling with KodaDot? </span>
                <span>
                  Head over to our <a href="/rmrk/faq">FAQ page.</a>
                </span>
              </p>
              <p>
                <span> Found issue? Have Feedback? </span>
                <span> Create issue on our GitHub. </span>
              </p>
            </div>
          </div>
          <b-button
            tag="a"
            href="https://github.com/kodadot/nft-gallery/issues/new/choose"
            target="_blank"
            rel="noopener noreferrer"
            type="is-primary"
          >
            Kodadot Github
          </b-button>
        </div>
      </div>
    </section>
  </section>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'

const components = {}
@Component<Landing>({
  metaInfo() {
    return {
      meta: [
        {
          property: 'og:title',
          content: 'KodaDot - Kusama NFT Market explorer',
        },
        {
          property: 'og:image',
          content: 'https://nft.kodadot.xyz/kodadot_carbonless.jpg',
        },
        {
          property: 'og:description',
          content: 'Low carbon NFT gallery on Kusama',
        },
        {
          property: 'twitter:title',
          content: 'KodaDot - Kusama NFT Market Explorer',
        },
        {
          property: 'twitter:description',
          content: 'Low carbon NFT gallery on Kusama',
        },
        {
          property: 'twitter:image',
          content: 'https://nft.kodadot.xyz/kodadot_carbonless.jpg',
        },
      ],
    }
  },
  components,
})
export default class Landing extends Vue {
  @Prop({ type: String, required: true, default: 'rmrk' }) prefix!: string
  @Prop({ type: String, default: 'RMRK Protocol' }) buildOn!: string

  layout() {
    return 'full-width-layout'
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables';

.homepage {
  content: '';
  width: 100%;
  height: 100%;
  color: $text;

  @include desktop {
    background: url('/homepage-bg.jpg') center bottom;
    background-repeat: no-repeat;
    background-size: contain;
  }

  &__title {
    display: inline-flex;
    padding: 16px 32px;
    margin: 0 0 60px;
    text-transform: uppercase;
    border: 4px solid $primary;
  }

  &__heading {
    font-size: 4rem;
    color: $text;
  }

  &__box {
    max-width: 600px;
    padding: 40px 48px;
    margin: 120px 0 132px;
    background-color: $scheme-main;
    border: 4px solid $primary;
    border-radius: 0;

    @include desktop {
      box-shadow: 28px -28px $black, 28px -28px 0 4px $primary;
    }
  }

  &__box-content {
    max-width: 464px;

    p,
    .button {
      margin-bottom: 32px;
    }

    p {
      display: flex;
      flex-direction: column;
    }
  }

  &__button {
    &--wrapped {
      height: auto;
      white-space: normal;
    }
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
