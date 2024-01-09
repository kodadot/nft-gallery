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
import { useCarouselNftEvents } from './utils/useCarouselEvents'

const { urlPrefix } = usePrefix()
const nfts = useCarouselNftEvents({
  type: 'newestList',
  limitDifference: {
    ahp: 3,
    rmrk: -1,
    ksm: -3,
  },
})
</script>
