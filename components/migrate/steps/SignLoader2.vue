<template>
  <div class="mb-5">
    <div class="flex items-center mb-4">
      <div class="mr-5">
        <NeoIcon v-if="iterations === 0" v-bind="iconSuccess" class="fa-2x" />
        <NeoIcon
          v-else-if="steps.includes('step2')"
          v-bind="iconLoading"
          class="fa-2x" />
        <NeoIcon v-else v-bind="iconIdle" class="fa-2x" />
      </div>
      <div>
        <p class="font-bold text-xl">
          {{ $t('migrate.signStep.migratingItems') }}
        </p>
        <p class="text-k-grey">
          {{ $t('migrate.signStep.signtx') }}
        </p>
      </div>
    </div>
    <div class="flex">
      <div class="v-border"></div>
      <div class="mb-4">
        <p v-if="iterations">
          {{ iterations }}/{{ maxIterations }} {{ $t('migrate.signStep.left') }}
        </p>
        <p v-else>{{ $t('migrate.signStep.done') }}</p>
      </div>
    </div>
    <div v-for="(iteration, index) in maxIterations" :key="index" class="flex">
      <div class="v-border"></div>
      <div class="mb-4 flex">
        <NeoIcon v-bind="itemLeftIcons(index)" class="mr-4" />
        <div>
          <p>{{ $t('migrate.signStep.migratingNItems', itemLeft(index)) }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Prefix } from '@kodadot1/static'
import { NeoIcon } from '@kodadot1/brick'
import {
  BATCH_SIZE,
  type Steps,
  calculateIterations,
  iconIdle,
  iconLoading,
  iconSuccess,
  useCollectionReady,
} from '@/composables/useMigrate'
import waifuApi from '@/services/waifu'

const { accountId } = useAuth()
const { apiInstance } = useApi()
const { howAboutToExecute, status } = useMetaTransaction()
const { $consola } = useNuxtApp()
const route = useRoute()
const router = useRouter()

const from = route.query.source as Prefix
const fromAccountId = route.query.accountId?.toString()
const itemCount = route.query.itemCount?.toString()
const collectionOwner = route.query.collectionOwner?.toString()
const collectionId = route.query.collectionId

const { collections } = await useCollectionReady(from, fromAccountId)
const fromCollection = collections.value.find(
  (collection) => collection.id === route.query.collectionId,
)

const api = await apiInstance.value
const { steps, updateSteps } = inject('steps') as {
  steps: Ref<Steps>
  updateSteps: (step: Steps) => void
}

const maxIterations = calculateIterations(itemCount)
const iterations = ref(maxIterations)
const batchPresigned = reactive({})

const itemLeft = (index) => {
  if (index === maxIterations - 1) {
    return parseInt(itemCount || '0') % BATCH_SIZE
  }

  return BATCH_SIZE
}

const itemLeftIcons = (index) => {
  if (steps.value.includes('init') || steps.value.includes('step1')) {
    return iconIdle
  }

  if (iterations.value < maxIterations - index) {
    return iconSuccess
  }

  if (iterations.value <= maxIterations - index) {
    return iconLoading
  }

  return iconIdle
}

const startStep2 = async () => {
  let nextCollectionId
  try {
    // eslint-disable-next-line no-restricted-syntax
    for (let index = 0; index < iterations.value; index++) {
      const fromCollectionId = collectionOwner
        ? collectionId
        : fromCollection?.id
      const checkSign = await waifuApi(
        `/relocations/${from}/${fromCollectionId}/iterations/${index}`,
        {
          method: 'PUT',
        },
      )

      const ownerSign = checkSign.data.filter(
        (item) => item.account === accountId.value,
      )

      if (!nextCollectionId) {
        nextCollectionId = ownerSign[0]?.to_collection
      }

      const presigned = ownerSign.map((item) => {
        const preSignInfo = api.createType('PalletNftsPreSignedMint', item.data)
        const create = api.tx.nfts.mintPreSigned(
          preSignInfo,
          {
            Ed25519: item.signature,
          },
          item.signer,
        )

        return create
      })

      batchPresigned[index] = presigned
    }

    if (collectionOwner && nextCollectionId) {
      router.push({
        query: {
          ...route.query,
          nextCollectionId,
        },
      })
    }

    executeStep2()
  } catch (error) {
    $consola.error('error step2', error)
  }
}

const executeStep2 = async () => {
  updateSteps('step2-migrate')

  if (iterations.value && status.value === TransactionStatus.Finalized) {
    iterations.value -= 1
  }

  if (status.value && status.value !== TransactionStatus.Finalized) {
    await delay(DETAIL_TIMEOUT)
    executeStep2()
    return
  }

  if (iterations.value) {
    const cb = api.tx.utility.batch
    const args = [toRaw(batchPresigned[maxIterations - iterations.value])]

    await howAboutToExecute(accountId.value, cb, args)
    await delay(DETAIL_TIMEOUT)
    executeStep2()
  }
}

watchEffect(() => {
  $consola.log('SignLoader2.vue', steps.value, status.value)

  if (steps.value === 'step2') {
    startStep2()
  }

  // Done, move to step3
  if (
    steps.value === 'step2-migrate' &&
    !iterations.value &&
    status.value === TransactionStatus.Finalized
  ) {
    updateSteps('step3')
  }
})
</script>
