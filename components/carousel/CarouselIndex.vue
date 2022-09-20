<template>
  <div>
    <div v-if="redesign && nfts.length">
      <h2 class="title is-2 has-text-dark">{{ title }}</h2>

      <CarouselList v-if="showCarousel" :nfts="nfts" />
    </div>

    <div v-if="!redesign && nfts.length" class="my-5">
      <Loader v-model="isLoading" />

      <div class="columns is-vcentered">
        <div class="column is-four-fifths">
          <h1 class="title is-2">{{ title }}</h1>
          <p class="subtitle is-size-5">{{ subtitle }}</p>
        </div>

        <div class="column has-text-right">
          <Pagination
            v-if="actionType === 'pagination'"
            v-model="page"
            simple
            preserve-scroll
            :total="totalItems"
            :per-page="1" />
        </div>
        <b-button
          v-if="actionType === 'link' && linkUrl && linkText"
          tag="nuxt-link"
          type="is-primary"
          inverted
          outlined
          icon-right="chevron-right"
          :to="linkUrl">
          {{ linkText }}
        </b-button>
      </div>

      <CarouselListOld :nfts="nfts" :page="page" :options="options" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import Pagination from '@/components/rmrk/Gallery/Pagination.vue'

import type { CarouselNFT } from '@/components/base/types'
import type { RowSeries } from '@/components/series/types'

const CarouselList = defineAsyncComponent(
  () => import('./module/CarouselAgnostic.vue')
)
const CarouselListOld = defineAsyncComponent(
  () => import('./module-old/CarouselList.vue')
)

const { redesign } = useExperiments()

const props = defineProps<{
  title?: string
  subtitle?: string
  nfts: CarouselNFT[] | RowSeries[]
  loading?: boolean
  actionType?: 'pagination' | 'link'
  linkUrl?: string
  linkText?: string
  itemUrl?: string
}>()

const itemUrl = computed(() => props.itemUrl || 'gallery')
provide('itemUrl', itemUrl.value)

const page = ref(1)
const isLoading = computed(() => props.loading)
const total = ref(props.nfts.length)
const totalItems = computed(() => total.value)
const showCarousel = computed(() => props.nfts.length)
const options = {
  itemsToShow: 2,
  breakpoints: {
    300: {
      itemsToShow: 1,
    },
    600: {
      itemsToShow: 1.5,
    },
    800: {
      itemsToShow: 2,
    },
    900: {
      itemsToShow: 2.5,
    },
    1000: {
      itemsToShow: 3,
    },
    1400: {
      itemsToShow: 4,
    },
    1800: {
      itemsToShow: 4.5,
    },
    2800: {
      itemsToShow: 5,
    },
  },
}
const breakpoints = Object.keys(options.breakpoints).reverse()

// adjust total based on breakpoints
const updateTotal = () => {
  const width = window.innerWidth

  for (const breakpoint of breakpoints) {
    if (parseInt(breakpoint) <= width) {
      const items = options.breakpoints[breakpoint].itemsToShow
      total.value = Math.round(props.nfts.length - items + 1)
      break
    }
  }
}

watch(
  () => props.nfts,
  () => {
    if (props.nfts.length && props.actionType === 'pagination') {
      updateTotal()
    }
  }
)
</script>
