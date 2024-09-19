<template>
  <section>
    <div class="flex flex-col md:flex-row gap-3">
      <div class="w-4/5">
        <h1 class="title is-2">
          {{ $t('series.title') }}
        </h1>
        <p class="subtitle text-xl">
          {{ $t('series.subtitle', { chain: urlPrefix }) }}
        </p>
      </div>
    </div>

    <SeriesTable />
  </section>
</template>

<script lang="ts" setup>
import { seriesInsightVisible } from '@/utils/config/permission.config'

const { urlPrefix } = usePrefix()

const checkRouteAvailability = () => {
  if (!seriesInsightVisible(urlPrefix.value)) {
    navigateTo('/')
  }
}

watch(urlPrefix, () => checkRouteAvailability())

onBeforeMount(() => checkRouteAvailability())

useHead({
  title: 'NFT artist rank',
  meta: [
    {
      name: 'description',
      content: 'Discover new artists based on ranking',
    },
  ],
})
</script>
