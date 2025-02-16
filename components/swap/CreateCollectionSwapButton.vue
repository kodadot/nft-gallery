<template>
  <NeoButton
    variant="secondary"
    class=""
    @click="onCreateCollectionSwapClick"
  >
    {{ $t('swap.createCollectionSwap') }}
  </NeoButton>
</template>

<script lang="ts" setup>
import { NeoButton } from '@kodadot1/brick'
import { useCollectionMinimal } from '@/components/collection/utils/useCollectionDetails'

const route = useRoute()
const { $i18n } = useNuxtApp()

const collectionId = computed(() => route.params.id.toString())
const swapStore = useAtomicSwapStore()
const { isCurrentAccount } = useAuth()

const isCollectionOwner = computed(() => isCurrentAccount(collection.value.currentOwner))

const { collection } = useCollectionMinimal({
  collectionId: collectionId,
})
const { onTradeActionClick } = useTradeActionClick(isCollectionOwner)

const onCreateCollectionSwapClick = () => {
  onTradeActionClick(() => {
    const swap = swapStore.createSwap(collectionId.value!, {
      isCollectionSwap: true,
      desired: [
        {
          id: null,
          collectionId: collectionId.value!,
          name: $i18n.t('swap.anyNftFromCollection', [collection.value?.name]),
          sn: null,
          meta: {
            image: collection.value?.meta?.image,
          },
        },
      ],

    })
    navigateToSwap(swap)
  })
}
</script>
