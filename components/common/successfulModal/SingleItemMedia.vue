<template>
  <BaseMediaItem class="border border-k-shade" :src="src" preview is-detail />

  <div class="mt-5 border-b-k-shade">
    <p class="is-size-6 capitalize font-bold text-center">
      {{ header }}
    </p>
    <p class="capitalize text-xs text-center mt-2">
      {{ $t('drops.artBy', [nftName]) }}
      <a
        v-safe-href="collectionUrl"
        class="has-text-link"
        target="_blank"
        rel="nofollow noopener noreferrer">
        {{ collectionName }}
      </a>
    </p>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  header: string
  src: string
  nftName: string
  collectionName: string
  collectionId: string
}>()

const { urlPrefix } = usePrefix()

const collectionUrl = computed(
  () => `/${urlPrefix.value}/collection/${props.collectionId}`,
)
</script>
