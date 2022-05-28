<template>
  <!-- <div>SanboxWork!</div> -->
  <SandboxedGalleryItem />
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

const components = {
  SandboxedGalleryItem: () => import('@/components/sandbox/SandboxedGalleryItem.vue')
}

@Component({ components })
export default class SandboxedGallery extends Vue {
}
</script>
