<template>
  <section>
    <div class="flex flex-col md:flex-row gap-3">
      <div class="w-4/5">
        <h1 class="title is-2">{{ $t('series.title') }}</h1>
        <p class="subtitle text-xl">
          {{ $t('series.subtitle', { chain: urlPrefix }) }}
        </p>
      </div>
      <div class="flex-1">
        <img
          v-if="isRemark"
          src="/rmrk-logo-pink-faded.png"
          alt="RMRK"
          class="chain-logo is-hidden-mobile" />
      </div>
    </div>

    <SeriesTable />
  </section>
</template>

<script lang="ts" setup>
import { seriesInsightVisible } from '@/utils/config/permission.config'

const { urlPrefix } = usePrefix()
const { isRemark } = useIsChain(urlPrefix)

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
