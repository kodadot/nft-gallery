<template>
  <section>
    <div class="mb-5">
      <h2 class="heading heading-is-4 text-bold uppercase">
        Carbonless NFT
        <span class="text__stroked heading heading-is-6"> Movement </span>
      </h2>
      <p class="max-w-600">
        We are trying to set a movement where artists can offset their mints.
        Simple as that
      </p>
      <b-button tag="nuxt-link" to="/carbonless" type="is-primary" class="my-5">
        Read more
      </b-button>
      <b-button
        tag="nuxt-link"
        to="/esCarbonless"
        type="is-primary"
        class="my-5">
        🇪🇸
      </b-button>
    </div>
    <div class="mb-5">
      <h2 class="heading heading-is-4 text-bold uppercase">
        Sustainability
        <span class="text__stroked heading heading-is-6"> is priority </span>
      </h2>
      <p class="max-w-600">
        As part of our micro-dao-bedrock-boostrap experiment, we would like to
        keep our efforts sustainable in the long-run and create trust from
        creators culture and economy for KodaDot that we will won’t dissapear
        tomorrow and keep running as long we can cover our efforts to keep it
        online and working.
      </p>
      <b-button
        tag="nuxt-link"
        to="/sustainability"
        type="is-primary"
        class="my-5">
        Read more
      </b-button>
      <b-button
        tag="nuxt-link"
        to="/esSustainability"
        type="is-primary"
        class="my-5">
        🇪🇸
      </b-button>
    </div>
    <div class="mb-5">
      <h2 class="heading heading-is-4 text-bold uppercase">
        What we
        <span class="text__stroked heading heading-is-6"> Accomplished </span>
      </h2>
      <p class="max-w-600">
        We made NFT Gallery on the top of Kusama using RMRK standard. This was
        our Milestone 1, the first step towards our Meta dreams of NFT Gallery
        and sort of our dreamy Metaverse.
      </p>
      <b-button
        type="is-primary"
        class="my-5"
        tag="a"
        href="https://medium.com/kodadot/traverse-to-the-prime-show-733d6046d3f5">
        Read more
      </b-button>
    </div>
    <div class="mb-5">
      <h2 class="heading heading-is-4 text-bold uppercase">
        CLIENT 1ST NFT GALLERY
        <span class="text__stroked heading heading-is-6"> TECHNICAL EXAM </span>
      </h2>
      <p class="max-w-600">
        Client-first, Onchain-first, Serverless-first, these words can sound
        like magic to you, but they exactly represent the actual technical state
        of KodaDot the NFT gallery.
      </p>
      <b-button
        type="is-primary"
        class="my-5"
        tag="a"
        href="https://medium.com/kodadot/client-first-nft-gallery-technical-examination-33db09dfdc97">
        Read more
      </b-button>
    </div>
  </section>
</template>
<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

@Component<About>({
  components: {},
})
export default class About extends Vue {}
</script>
