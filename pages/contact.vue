<template>
  <Contact />
</template>

<script lang="ts" >
import { Component, Vue } from 'nuxt-property-decorator'
import Contact from '@/components/landing/Contact.vue'
import createSiteMeta from '@/utils/createSiteMeta'

@Component({
  components: {
    Contact
  },
  head() {
    const title = 'KodaDot cares about environmental impact'
    const metaData = {
      title: title,
      url: `${this.$config.baseUrl}/contact`,
      image: `${this.$config.baseUrl}/kodadot_carbonless.jpg`,
    }
    return {
      title: title,
      meta: [...createSiteMeta(metaData)]
    }
  }
})

export default class ContactPage extends Vue {}
</script>
