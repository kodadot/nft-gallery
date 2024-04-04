<template>
  <div class="flex flex-col items-center">
    <BaseMediaItem
      class="border border-k-shade w-[200px] h-[200px]"
      :src="src"
      :animation-src="src"
      :mime-type="mediaMimeType"
      preview
      is-detail />

    <div class="mt-5 border-b-k-shade">
      <p class="text-base capitalize font-bold text-center">
        {{ header }}
      </p>
      <p v-if="showPrice" class="capitalize text-center mt-2">
        {{ formatted }} ~ {{ usd }}
      </p>
      <p v-else class="capitalize text-xs text-center mt-2">
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
const props = defineProps<{
  header: string
  src: string
  nftName: string
  collectionName: string
  collectionId: string
  mediaMimeType?: string
  price?: string | undefined
  showPrice?: boolean
}>()

const { decimals, chainSymbol } = useChain()
const { urlPrefix } = usePrefix()

const { usd, formatted } = useAmount(
  computed(() => props.price),
  decimals,
  chainSymbol,
)
</script>
