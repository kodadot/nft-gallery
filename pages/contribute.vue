<template>
  <ContentMarkdown type="contribute" />
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

@Component({
  components: {
    ContentMarkdown: () => import('@/components/ContentMarkdown.vue'),
  },
})
export default class Contribute extends Vue {}
</script>
