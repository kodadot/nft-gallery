<template>
  <div class="search-result-item mb-2">
    <div class="media">
      <div class="media-left">
        <div v-if="isLoading" class="loading loading-image">&nbsp;</div>
        <BasicImage v-else rounded custom-class="is-64x64" :src="image" />
      </div>
      <div v-if="isLoading" class="media-content">
        <div class="mt-2 loading loading-title">&nbsp;</div>
        <div class="mt-2 loading loading-text">&nbsp;</div>
      </div>
      <div v-else class="media-content">
        <slot name="content"></slot>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'

@Component({
  components: {
    BasicImage: () => import('@/components/shared/view/BasicImage.vue'),
  },
})
export default class SearchResultItem extends Vue {
  @Prop({ type: Boolean, default: false }) public isLoading!: boolean
  @Prop({ type: String, default: '' }) public image!: string
}
</script>

<style lang="scss">
@import '@/styles/abstracts/variables';
.search-result-item {
  .loading-image {
    width: 64px;
    height: 64px;
    border-radius: 64px;
  }
  .loading-title {
    width: 240px;
    border-radius: 4px;
  }
  .loading-text {
    border-radius: 4px;
    width: 150px;
  }
  .loading {
    background: #4d5358;
    animation: loading-keyframes 2s linear infinite;
  }
  @keyframes loading-keyframes {
    0% {
      background-color: #4d5358;
    }
    50% {
      background-color: #919aa1;
    }
    100% {
      background-color: #4d5358;
    }
  }
}
</style>
