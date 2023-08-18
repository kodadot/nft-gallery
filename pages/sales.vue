<template>
  <section>
    <StatsHeader
      :title="$t('sales.title')"
      :subtitle="$t('sales.subtitle', { chain: urlPrefix })" />

    <SalesTable />
  </section>
</template>
<script lang="ts">
import { salesVisible } from '@/utils/config/permission.config'

export default {
  name: 'Sales',
  setup() {
    const { urlPrefix } = usePrefix()

    const checkRouteAvailability = () => {
      if (!salesVisible(urlPrefix.value)) {
        navigateTo('/')
      }
    }

    watch(urlPrefix, () => checkRouteAvailability())

    checkRouteAvailability()

    return {
      urlPrefix,
    }
  },
  head() {
    const title = 'Latest KUSAMA Sales'
    const metaData = {
      title,
      type: 'profile',
      description: 'Featuring the most recently sold NFTs on Kusama',
      url: '/sales',
      image: `${this.$config.public.baseUrl}/k_card.png`,
    }
    return {
      title,
      meta: [...this.$seoMeta(metaData)],
    }
  },
}
</script>
