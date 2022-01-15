<template>
  <div>
    <section class="hero is-dark">
      <div class="hero-body">
        <div class="container">
          <div class="columns">
            <div class="column is-12">
              <div class="mb-5">
                <h2 class="heading heading-is-4 text-bold uppercase">
                  Carbonless NFT
                  <span class="text__stroked heading heading-is-6">
                    Movement
                  </span>
                </h2>
                <p class="max-w-600">
                  We are trying to set a movement where artists can offset their mints. Simple as that
                </p>
                <b-button
                  type="is-primary"
                  class="my-5"
                >
                <router-link :to="{ name: 'carbonless'}">
                  Read more
                </router-link>
                </b-button>
                <b-button
                  type="is-primary"
                  class="my-5"
                >
                <router-link :to="{ name: 'esCarbonless'}">
                  🇪🇸
                </router-link>
                </b-button>

              </div>
              <div class="mb-5">
                <h2 class="heading heading-is-4 text-bold uppercase">
                  Sustainability
                  <span class="text__stroked heading heading-is-6">
                    is priority
                  </span>
                </h2>
                <p class="max-w-600">
                  As part of our micro-dao-bedrock-boostrap experiment, we would like to keep our efforts sustainable in the long-run and create trust from creators culture and economy for KodaDot that we will won’t dissapear tomorrow and keep running as long we can cover our efforts to keep it online and working.
                </p>
                <b-button
                  type="is-primary"
                  class="my-5"
                >
                <router-link :to="{ name: 'sustainability'}">
                  Read more
                </router-link>
                </b-button>
                <b-button
                  type="is-primary"
                  class="my-5"
                >
                <router-link :to="{ name: 'esSustainability'}">
                  🇪🇸
                </router-link>
                </b-button>

              </div>
              <div class="mb-5">
                <h2 class="heading heading-is-4 text-bold uppercase">
                  What we
                  <span class="text__stroked heading heading-is-6">
                    Accomplished
                  </span>
                </h2>
                <p class="max-w-600">
                  We made NFT Gallery on the top of Kusama using RMRK standard. This was our Milestone 1, the first step towards our Meta dreams of NFT Gallery and sort of our dreamy Metaverse.
                </p>
                <b-button
                  type="is-primary"
                  class="my-5"
                >
                <a href="https://medium.com/kodadot/traverse-to-the-prime-show-733d6046d3f5">
                  Read more
                </a>
                </b-button>
              </div>
              <div class="mb-5">
                <h2 class="heading heading-is-4 text-bold uppercase">
                  CLIENT 1ST NFT GALLERY
                  <span class="text__stroked heading heading-is-6">
                    TECHNICAL EXAM
                  </span>
                </h2>
                <p class="max-w-600">
                  Client-first, Onchain-first, Serverless-first, these words can sound like magic to you, but they exactly represent the actual technical state of KodaDot the NFT gallery.
                </p>
                <b-button
                  type="is-primary"
                  class="my-5"
                >
                <a href="https://medium.com/kodadot/client-first-nft-gallery-technical-examination-33db09dfdc97">
                  Read more
                </a>
                </b-button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
<script lang="ts" >
import { Component, Vue } from 'vue-property-decorator'


@Component<About>({
  components: {}
})
export default class About extends Vue {

}
</script>
