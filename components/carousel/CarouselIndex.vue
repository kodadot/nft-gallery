<template>
  <div v-if="nfts.length" class="my-5">
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
          :total="total"
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

    <CarouselList :nfts="nfts" :page="page" />
  </div>
</template>

<script lang="ts" setup>
import Pagination from '@/components/rmrk/Gallery/Pagination.vue'
import CarouselList from './module-old/CarouselList.vue'

import type { CarouselNFT } from '@/components/base/types'
import type { RowSeries } from '@/components/series/types'

const props = defineProps<{
  title?: string
  subtitle?: string
  nfts: CarouselNFT[] | RowSeries[]
  loading?: boolean
  actionType?: 'pagination' | 'link'
  linkUrl?: string
  linkText?: string
}>()

const page = ref(1)
const isLoading = computed(() => props.loading)
const total = computed(() => props.nfts.length)
</script>
