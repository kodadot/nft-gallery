<template>
  <div data-cy="latest-sales">
    <!-- <Loader v-model="isLoading" /> -->

    <div class="columns is-vcentered">
      <div class="column is-four-fifths">
        <h1 class="title is-2">{{ title }}</h1>
        <p class="subtitle is-size-5">{{ subtitle }}</p>
      </div>

      <div class="column has-text-right">
        <!-- <Pagination
          v-model="page"
          simple
          preserve-scroll
          :total="total"
          :per-page="1" /> -->
      </div>
    </div>

    <CarouselList :nfts="nfts" :page="page" />
  </div>
</template>

<script lang="ts" setup>
import CarouselList from './module-old/CarouselList.vue'

defineProps<{
  title?: string
  subtitle?: string
  nfts: any[] // eslint-disable-line @typescript-eslint/no-explicit-any
  page?: number
}>()
</script>
