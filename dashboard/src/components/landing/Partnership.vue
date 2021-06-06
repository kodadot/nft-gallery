<template>
  <div>
    <section class="hero is-dark">
      <div class="hero-body">
        <div class="container">
          <div class="columns">
            <div class="column is-12">
              <h1>
              Partnership
              </h1><br>
              We will have some partnership here announced, soon.<br>
              <a href="https://discord.gg/u6ymnbz4PR">If you want to know it sooner, join our Discord</a>

            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
<script lang="ts" >
import { Component, Vue } from 'vue-property-decorator';


@Component<Partnership>({
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
export default class Partnership extends Vue {

}
</script>
