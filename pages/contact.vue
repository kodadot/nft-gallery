<template>
  <Contact />
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import Contact from '@/components/landing/Contact.vue'

@Component({
  components: {
    Contact,
  },
  head() {
    const title = 'KodaDot cares about environmental impact'
    const metaData = {
      title,
      type: 'article',
      url: `${this.$config.baseUrl}/contact`,
      image: `${this.$config.baseUrl}/k_card_mint.png`,
    }
    return {
      title,
      meta: [...this.$seoMeta(metaData)],
    }
  },
})
export default class ContactPage extends Vue {}
</script>
