<template>
  <div class="search-result-item" :class="{ 'loading-item': isLoading }">
    <div class="media">
      <div class="media-left" :class="{ border: !isLoading }">
        <NeoSkeleton v-if="isLoading" width="64px" height="64px"></NeoSkeleton>
        <BasicImage v-else custom-class="is-64x64" :src="image" />
      </div>
      <div
        v-if="isLoading"
        class="media-content is-flex is-flex-direction-column is-justify-content-center pt-2">
        <NeoSkeleton
          :count="1"
          :width="240"
          :height="22"
          size="medium"
          active></NeoSkeleton>
        <NeoSkeleton
          :count="1"
          :width="150"
          :height="22"
          size="medium"
          active></NeoSkeleton>
      </div>
      <div v-else class="media-content">
        <slot name="content"></slot>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'
import { NeoSkeleton } from '@kodadot1/brick'

@Component({
  components: {
    BasicImage: () => import('@/components/shared/view/BasicImage.vue'),
    NeoSkeleton,
  },
})
export default class SearchResultItem extends Vue {
  @Prop({ type: Boolean, default: false }) public isLoading!: boolean
  @Prop({ type: String, default: '' }) public image!: string
}
</script>
<style scoped>
.media-left :deep img {
  max-height: 100%;
}
</style>
