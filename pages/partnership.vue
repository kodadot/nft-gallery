<template>
  <section>
    <h1>Partnership</h1>
    <br>
    We will have some partnership here announced, soon.<br>
    <a href="https://discord.gg/u6ymnbz4PR">If you want to know it sooner, join our Discord</a>
  </section>
</template>

<script lang="ts" >
import { Component, Vue } from 'nuxt-property-decorator'
import createSiteMeta from '@/utils/createSiteMeta'

@Component<Partnership>({
  head() {
    const title = 'KodaDot cares about environmental impact'
    const metaData = {
      title: title,
      url: `${this.$config.baseUrl}/partnership`,
      image: `${this.$config.baseUrl}/kodadot_carbonless.jpg`,
    }
    return {
      title: title,
      meta: [...createSiteMeta(metaData)]
    }
  }
})
export default class Partnership extends Vue {}
</script>
