<template>
  <div>
    <section class="hero is-dark">
      <div class="hero-body">
        <div class="container">
          <div class="columns">
            <div class="column is-12">
              About
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
<script lang="ts" >
import { Component, Vue } from 'vue-property-decorator';


@Component<About>({
  metaInfo() {
    return {
      title: 'KodaDOT cares about environmental impact',
      titleTemplate: '%s | Low Carbon NFTs',
      meta: [
        { name: 'description', content: 'Creating Carbonless NFTs on Kusama' },
        { property: 'og:title', content: 'KodaDOT cares about environmental impact'},
        { property: 'og:image', content: 'https://nft.kodadot.xyz/kodadot_carbonless.jpg'},
        { property: 'og:description', content: 'Creating Carbonless NFTs on Kusama'},
        { property: 'twitter:title', content: 'KodaDOT cares about environmental impact'},
        { property: 'twitter:description', content: 'Creating Carbonless NFTs on Kusama'},
        { property: 'twitter:image', content: 'https://nft.kodadot.xyz/kodadot_carbonless.jpg'},
      ]
    }
  },
  components: {}
})
export default class About extends Vue {

}
</script>
