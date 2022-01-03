<template>
  <Landing prefix="rmrk" />
</template>

<script lang="ts" >
import { Component, Vue } from 'nuxt-property-decorator'

@Component({
  name: 'LandingPage',
  components: {
    Landing: () => import('@/components/landing/Landing.vue')
  }
})

export default class LandingPage extends Vue {
  head() {
    return {
      meta: [
        {
          property: 'og:title',
          content: 'KodaDot - Kusama NFT Market explorer',
        },
        {
          property: 'og:image',
          content: '/kodadot_mint.png',
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
          content: '/kodadot_mint.png',
        },
      ],
    }
  }

  layout() {
    return 'full-width-layout'
  }
}
</script>
