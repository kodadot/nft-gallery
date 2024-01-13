<template>
  <div class="mb-5">
    <div class="flex items-center mb-4">
      <div class="mr-5">
        <NeoIcon
          v-if="fromNfts?.length === nextNfts?.length"
          v-bind="iconSuccess"
          class="fa-2x" />
        <NeoIcon v-else v-bind="iconIdle" class="fa-2x" />
      </div>
      <div>
        <p class="font-bold text-xl">Comprehensive Collection Scan</p>
        <p class="text-k-grey">
          Verifying your collection on the destination chain.
        </p>
      </div>
    </div>
    <div class="flex mb-4">
      <div class="v-border"></div>
      <div>
        <p class="text-k-grey italic">no action needed</p>
      </div>
    </div>

    <div class="is-flex is-align-items-center mb-4">
      <div class="mr-5">
        <NeoIcon v-bind="whichIcon()" class="fa-2x" />
      </div>
      <div>
        <p class="font-bold text-xl">
          {{ $t('migrate.signStep.finalization') }}
        </p>
        <p class="text-k-grey">
          {{ $t('migrate.signStep.authorize') }}
        </p>
      </div>
    </div>
    <div class="flex">
      <div class="v-border"></div>
      <div class="mb-4">1/1 {{ $t('migrate.signStep.left') }}</div>
    </div>
    <div class="flex">
      <div class="v-border"></div>
      <div class="mb-4 flex">
        <NeoIcon v-bind="whichIcon()" class="mr-4" />
        <div :class="textColor">
          <p>{{ $t('migrate.signStep.finalizingItems', [itemCount]) }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Prefix } from '@kodadot1/static'
import { Collections, NFTs } from '@/composables/transaction/types'
import { NeoIcon } from '@kodadot1/brick'
import {
  type Steps,
  iconIdle,
  iconLoading,
  iconSuccess,
} from '@/composables/useMigrate'
import nftIdListByCollection from '@/queries/subsquid/general/nftIdListByCollection.graphql'

const route = useRoute()
const { transaction, status } = useTransaction()
const { urlPrefix } = usePrefix()
const { accountId } = useAuth()
const { $consola } = useNuxtApp()

const from = route.query.source as Prefix
const fromAccountId = route.query.accountId?.toString()
const fromCollectionId = route.query.collectionId?.toString()
const nextCollectionId = computed(
  () => route.query.nextCollectionId?.toString(),
)

const itemCount = route.query.itemCount?.toString()

type NftIds = {
  nfts?: {
    id: string
  }[]
}

const { steps, updateSteps } = inject('steps') as {
  steps: Ref<Steps>
  updateSteps: (step: Steps) => void
}

const whichIcon = () => {
  if (steps.value === 'step4') {
    return iconSuccess
  }

  if (steps.value === 'step3-burn' || steps.value === 'step3-burn-collection') {
    return iconLoading
  }

  return iconIdle
}

const textColor = computed(() => {
  if (whichIcon().icon === 'circle') {
    return 'text-k-grey'
  }

  return 'text-text-color'
})

const { data: getFromNfts } = useGraphql({
  queryName: 'nftIdListByCollection',
  clientName: from,
  variables: {
    id: fromCollectionId,
    search: [{ currentOwner_eq: fromAccountId }],
  },
})
const fromNfts = computed(() => (getFromNfts.value as NftIds)?.nfts)

const nextNfts = ref()
const checkNextNfts = async () => {
  const { data } = await useAsyncQuery({
    query: nftIdListByCollection,
    variables: {
      id: nextCollectionId.value,
      search: [{ currentOwner_eq: accountId.value }],
    },
    clientId: urlPrefix.value,
  })

  nextNfts.value = (data.value as NftIds)?.nfts
}

const burnItems = async () => {
  const ids = fromNfts.value?.map((item) => item.id) || []

  await transaction(
    {
      interaction: NFTs.BURN_MULTIPLE,
      nftIds: ids,
      urlPrefix: from,
    },
    from,
  )
  updateSteps('step3-burn')
}

const burnCollection = async () => {
  if (fromCollectionId) {
    await transaction(
      {
        interaction: Collections.DELETE,
        collectionId: fromCollectionId,
        urlPrefix: from,
      },
      from,
    )
    updateSteps('step3-burn-collection')
  }
}

const congratsPage = () => {
  updateSteps('step4')
  navigateTo({
    path: '/migrate/congrats',
    query: {
      ...route.query,
    },
  })
}

// check next nfts
watchDebounced(
  [steps, nextCollectionId, nextNfts],
  async () => {
    if (
      steps.value === 'step3' &&
      nextCollectionId.value &&
      fromNfts.value?.length !== nextNfts.value?.length
    ) {
      await checkNextNfts()
    }
  },
  { debounce: 1000 },
)

watchEffect(async () => {
  $consola.info('SignLoader3', steps.value, fromNfts.value, nextNfts.value)

  // burn items
  if (
    steps.value === 'step3' &&
    fromNfts.value?.length === nextNfts.value?.length
  ) {
    burnItems()
  }

  // ensure to burn items
  if (
    steps.value === 'step3-burn' &&
    status.value === TransactionStatus.Finalized
  ) {
    burnCollection()
  }

  // ensure to burn collection
  if (
    steps.value === 'step3-burn-collection' &&
    status.value === TransactionStatus.Finalized
  ) {
    congratsPage()
  }
})
</script>
