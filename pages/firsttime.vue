<template>
  <div class="markdown">
    <div>
      <nuxt-content :document="page" />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
@Component({})

export default class FirstTime extends Vue{
  async asyncData({ $content }) {
    const page = await $content('firsttime').fetch()

    return {
      page,
    }
  }
}
</script>

