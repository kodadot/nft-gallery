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

    useHead({
      title: 'Latest KUSAMA Sales',
      meta: [
        {
          name: 'description',
          content: 'Featuring the most recently sold NFTs on Kusama',
        },
      ],
    })

    return {
      urlPrefix,
    }
  },
}
</script>
