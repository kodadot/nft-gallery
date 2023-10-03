<template>
  <div>
    <h3 class="title is-3">{{ $t('drops.recentMints') }}</h3>

    <CarouselList v-if="showCarousel" :nfts="nfts" :step="3">
      <template #card-info="{ item }">
        <div class="carousel-info is-flex is-flex-direction-column">
          <nuxt-link
            :to="urlOf({ id: item.id, url: 'gallery', chain: item.chain })"
            :title="item.name"
            class="has-text-weight-bold carousel-info-name">
            <span class="is-ellipsis">{{ item.name || '--' }}</span>
          </nuxt-link>

          <div class="is-flex is-flex-direction-column is-align-items-start">
            <div
              class="is-flex is-justify-content-space-between is-align-items-center">
              <p class="is-size-7 chain-name">{{ $t('drops.mintedBy') }}</p>
              <nuxt-link
                :to="`/${urlPrefix}/u/${item.currentOwner}`"
                class="has-text-link ml-2">
                <IdentityIndex
                  ref="identity"
                  :address="item.currentOwner"
                  show-clipboard />
              </nuxt-link>
            </div>
            <p class="is-size-7 chain-name">{{ item.timestamp }}</p>
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
  () => import('./module/CarouselAgnostic.vue')
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
  }
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
  flattenNFT(latestEvents.value?.events || [], urlPrefix.value)
)
const showCarousel = computed(() => nfts.value.length)
</script>
