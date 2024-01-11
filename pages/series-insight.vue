<template>
  <section>
    <div class="columns">
      <div class="column is-four-fifths">
        <h1 class="title is-2">{{ $t('series.title') }}</h1>
        <p class="subtitle is-size-5">
          {{ $t('series.subtitle', { chain: urlPrefix }) }}
        </p>
      </div>
      <div class="column">
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
