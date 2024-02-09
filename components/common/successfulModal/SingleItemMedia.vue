<template>
  <div class="flex flex-col items-center">
    <BaseMediaItem
      class="border border-k-shade w-[200px] h-[200px]"
      :src="src"
      preview
      is-detail />

    <div class="mt-5 border-b-k-shade">
      <p class="text-base capitalize font-bold text-center">
        {{ header }}
      </p>
      <p class="capitalize text-xs text-center mt-2">
        {{ $t('drops.artBy', [nftName]) }}
        <nuxt-link
          :to="`/${urlPrefix}/collection/${collectionId}`"
          class="has-text-link"
          target="_blank"
          rel="nofollow noopener noreferrer">
          {{ collectionName }}
        </nuxt-link>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  header: string
  src: string
  nftName: string
  collectionName: string
  collectionId: string
}>()

const { urlPrefix } = usePrefix()
</script>
