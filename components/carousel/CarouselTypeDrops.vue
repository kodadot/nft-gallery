<template>
  <div ref="container">
    <template v-if="isDynamicGridReady">
      <CarouselModuleCarouselAgnostic
        v-if="isReady"
        :key="dropsAlias.join('-')"
        v-slot="{ item }"
        :items="drops"
        :config="config"
      >
        <DropsDropCard
          :drop="item"
          emit-on-click
          @click="onDropClick"
        />
      </CarouselModuleCarouselAgnostic>
      <CarouselModuleCarouselAgnostic
        v-else
        :items="Array(skeletonCount).fill({ id: 'drop-skeleton' })"
        :config="config"
      >
        <DropsDropCardSkeleton />
      </CarouselModuleCarouselAgnostic>
    </template>
  </div>
</template>

<script lang="ts" setup>
import type { Drop } from '@/components/drops/useDrops'
import { useDrops } from '@/components/drops/useDrops'
import { openReconnectWalletModal } from '@/components/common/ConnectWallet/openReconnectWalletModal'

let queries = {
  limit: 12,
  active: [true],
  chain: ['ahp', 'base'],
}

const { urlPrefix } = usePrefix()
const { getWalletVM } = storeToRefs(useWalletStore())

if (!isProduction && urlPrefix.value === 'ahk') {
  queries = {
    ...queries,
    chain: ['ahk'],
  }
}

const container = ref()

const { accountId } = useAuth()
const { vmOf } = useChain()
const router = useRouter()
const { cols, isReady: isDynamicGridReady } = useDynamicGrid({
  container,
  itemMintWidth: computed(() => DROP_CARD_MIN_WIDTH),
})

const perView = computed(() => (cols.value === 1 ? 1.2 : cols.value))
const config = computed(() => ({
  slides: { perView: perView.value, spacing: 16 },
}))
const skeletonCount = computed(() =>
  Number.isInteger(perView.value) ? perView.value : Math.ceil(perView.value),
)

const { drops, loaded: isReady } = useDrops(queries)
const dropsAlias = computed(() => drops.value.map(drop => drop.alias))

const onDropClick = ({ path, drop }: { path: string, drop: Drop }) => {
  if (getWalletVM.value === vmOf(drop.chain) || !accountId.value) {
    router.push(path)
    return
  }

  openReconnectWalletModal({
    onSuccess: () => router.push(path),
  })
}
</script>
