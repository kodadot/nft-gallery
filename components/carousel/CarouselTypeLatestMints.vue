<template>
  <div>
    <h3 class="title is-3">{{ $t('drops.recentMints') }}</h3>

    <CarouselList v-if="showCarousel" :nfts="nfts" :step="3">
      <template #card-info="{ item }">
        <div
          class="carousel-info whitespace-nowrap overflow-hidden text-ellipsis p-4 flex flex-col">
          <nuxt-link
            :to="urlOf({ id: item.id, url: 'gallery', chain: item.chain })"
            :title="item.name"
            class="font-bold overflow-hidden whitespace-nowrap text-ellipsis w-full">
            <span class="is-ellipsis">{{ item.name || '--' }}</span>
          </nuxt-link>

          <div class="flex flex-col items-start">
            <div class="justify-between items-center hidden md:flex">
              <p class="text-xs text-k-grey">
                {{ $t('drops.mintedBy') }}
              </p>
              <nuxt-link
                :to="`/${urlPrefix}/u/${item.currentOwner}`"
                class="text-k-blue hover:text-k-blue-hover ml-2">
                <IdentityIndex
                  ref="identity"
                  :address="item.currentOwner"
                  show-clipboard />
              </nuxt-link>
            </div>
            <p class="text-xs text-k-grey">{{ item.timestamp }}</p>
          </div>
        </div>
      </template>
    </CarouselList>
  </div>
</template>

<script lang="ts" setup>
import { flattenNFT } from './utils/useCarouselEvents'
import { useCarouselUrl } from './utils/useCarousel'
const CarouselList = defineAsyncComponent(
  () => import('./module/CarouselAgnostic.vue'),
)

const { urlOf } = useCarouselUrl()
const { urlPrefix } = usePrefix()

const props = withDefaults(
  defineProps<{
    collectionId: string
    interaction: string
    limit?: number
  }>(),
  {
    limit: 10,
  },
)

const { data: latestEvents } = useGraphql({
  queryName: 'latestEvents',
  variables: {
    limit: props.limit,
    orderBy: 'timestamp_DESC',
    where: {
      interaction_eq: props.interaction,
      nft: {
        collection: {
          id_eq: props.collectionId,
        },
      },
    },
  },
})

const nfts = computed(() =>
  flattenNFT(latestEvents.value?.events || [], urlPrefix.value),
)

const showCarousel = computed(() => nfts.value.length)
</script>
