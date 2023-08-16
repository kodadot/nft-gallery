<template>
  <section>
    <StatsHeader
      :title="$t('sales.title')"
      :subtitle="$t('sales.subtitle', { chain: urlPrefix })" />

    <SalesTable />
  </section>
</template>
<script lang="ts">
import { salesVisible } from '@/utils/config/permision.config'

export default {
  name: 'Sales',
  setup() {
    const { urlPrefix } = usePrefix()
    const router = useRouter()

    const checkRouteAvailability = () => {
      if (!salesVisible(urlPrefix.value)) {
        router.push('/')
      }
    }

    watch(urlPrefix, () => checkRouteAvailability())

    return {
      urlPrefix,
      checkRouteAvailability,
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
  beforeMount() {
    this.checkRouteAvailability()
  },
}
</script>
