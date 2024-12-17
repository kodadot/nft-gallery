<template>
  <UCarousel
    v-slot="{ item }"
    :items="drops"
    arrows
  >
    <div class="w-80 lg:w-96 pr-4">
      <DropsDropItem
        :drop="item"
        :show-minted="true"
      />
    </div>
  </UCarousel>
</template>

<script lang="ts" setup>
import { useQuery } from '@tanstack/vue-query'
import { dropsVisible } from '@/utils/config/permission.config'
import { getDrops } from '@/services/fxart'

const { urlPrefix } = usePrefix()

const { data: drops } = useQuery({
  queryKey: ['drop-items-carousel', urlPrefix.value],
  queryFn: () => getDrops({
    active: [true],
    chain: dropsVisible(urlPrefix.value) ? [urlPrefix.value] : ['base', 'ahp'],
    limit: 14,
  }),
})
</script>
