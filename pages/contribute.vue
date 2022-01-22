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

export default class Contribute extends Vue{
  async asyncData({ $content }) {
    const page = await $content('contribute').fetch()

    return {
      page,
    }
  }
}
</script>

