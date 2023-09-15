<template>
  <CarouselIndex
    :key="ids"
    :title="$t('general.newestListHeading')"
    :subtitle="$t('general.newestListDesc')"
    :nfts="nfts"
    action-type="link"
    :link-url="`/${urlPrefix}/explore/items/?search=&sort=updatedAt_DESC`"
    :link-text="$t('helper.seeMore')" />
</template>

<script lang="ts" setup>
import { useCarouselNftEvents } from './utils/useCarouselEvents'

const { urlPrefix } = usePrefix()
const { nfts, ids } = await useCarouselNftEvents({ type: 'newestList' })
</script>
