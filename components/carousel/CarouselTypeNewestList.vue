<template>
  <CarouselIndex
    :title="$t('general.newestListHeading')"
    :subtitle="$t('general.newestListDesc')"
    :nfts="nfts.value"
    action-type="link"
    :link-url="`/${urlPrefix}/explore/items/?search=&sort=updatedAt_DESC`"
    :link-text="$t('helper.seeMore')" />
</template>

<script lang="ts" setup>
import { limit, useCarouselNftEvents } from './utils/useCarouselEvents'

const { urlPrefix } = usePrefix()
const nfts = useCarouselNftEvents({
  type: 'newestList',
  limit: {
    ahp: limit + 1,
    rmrk: limit - 1,
    ksm: limit - 3,
  },
})
</script>
