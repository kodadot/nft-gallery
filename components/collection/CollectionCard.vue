<template>
  <div class="collection-card card">
    <nuxt-link :to="`/${urlPrefix}/collection/${collection.id}`">
      <BasicImage
        :src="collection.image"
        :alt="collection.name"
        custom-class="collection-card__image-wrapper" />

      <div class="card-content">
        <CollectionDetail
          :nfts="collection.nfts"
          :name="collection.name"
          :image="collection.image" />
        <b-skeleton :active="isLoading" />
      </div>
    </nuxt-link>
  </div>
</template>

<script setup lang="ts">
import { CollectionWithMeta } from '@/components/rmrk/service/scheme'
import BasicImage from '@/components/shared/view/BasicImage.vue'
import CollectionDetail from '@/components/rmrk/Gallery/CollectionDetail.vue'
const { urlPrefix } = usePrefix()

const props = defineProps<{
  collection: CollectionWithMeta
  isLoading: boolean
}>()
</script>

<style lang="scss">
@import '@/styles/abstracts/variables';

.collection-card {
  font-family: 'Work Sans';
  border: 1px solid $black;
  border-radius: 0;

  cursor: pointer;

  &__image-wrapper {
    padding-top: 40% !important;
    &-sub {
      height: 70px;
      width: 70px;
      padding: 0 !important;
      border: 6px solid $white;
      transform: translate(20px, -50%);
      img {
        object-fit: contain;
      }
    }
  }

  .collection-name {
    width: 100px;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
  .card-content {
    padding: 0;
    border-top: 1px solid $black;

    .collection-title {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      color: #fff;
      font-size: 1.5rem;
    }
    .collection-title-class {
      max-width: 100%;
      text-align: center;
    }
  }

  .card-image img {
    border-radius: 0px;
    top: 50%;
    transition: all 0.3s;
    display: block;
    width: 100%;
    height: auto;
    transform: scale(1);
  }
}
</style>
