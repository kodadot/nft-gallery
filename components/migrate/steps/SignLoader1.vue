<template>
  <div v-if="!collectionOwner" class="mb-5" :class="whichIcon().textColor">
    <div class="flex items-center mb-4">
      <div class="mr-5">
        <NeoIcon v-bind="whichIcon()" class="fa-2x" />
      </div>
      <div>
        <p class="font-bold text-xl text-text-color">
          {{ $t('migrate.signStep.initiation') }}
        </p>
        <p class="text-k-grey">
          {{ $t('migrate.signStep.journey') }}
        </p>
      </div>
    </div>
    <div class="flex">
      <div class="v-border"></div>
      <div class="mb-4 text-text-color">
        <p v-if="step1Iterations">
          {{ step1Iterations }}/2 {{ $t('migrate.signStep.left') }}
        </p>
        <p v-else>{{ $t('migrate.signStep.done') }}</p>
      </div>
    </div>
    <div class="flex">
      <div class="v-border"></div>
      <div class="mb-4 w-full flex">
        <div class="mr-4">
          <NeoIcon v-bind="whichIcon()" />
        </div>
        <div>
          <p>{{ $t('create collection') }}</p>
          <nuxt-link
            v-if="step1Iterations === 0"
            target="_blank"
            class="text-k-blue hover:text-k-blue-hover"
            :to="`/${client}/collection/${nextId}`">
            {{ $t('viewtx') }} <NeoIcon icon="arrow-up-right" />
          </nuxt-link>
        </div>
        <div
          v-if="isError || status === TransactionStatus.Cancelled"
          class="flex-1 text-right">
          <NeoButton variant="pill" size="small" @click="tryAgain()">
            {{ $t('helper.tryAgain') }}
          </NeoButton>
        </div>
      </div>
    </div>
    <div class="flex">
      <div class="v-border"></div>
      <div class="mb-4 flex">
        <div class="mr-4">
          <NeoIcon v-bind="whichIcon()" />
        </div>
        <div>
          <p>{{ $t('migrate.signStep.prepare') }}</p>
          <p class="text-k-grey text-xs">
            {{ $t('migrate.signStep.noSignature') }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Prefix } from '@kodadot1/static'
import { NeoButton, NeoIcon } from '@kodadot1/brick'
import {
  type Steps,
  iconError,
  iconIdle,
  iconLoading,
  iconSuccess,
  useCollectionReady,
} from '@/composables/useMigrate'
import { useStatemineNewCollectionId } from '@/composables/transaction/mintCollection/useNewCollectionId'
import { createArgsForNftPallet } from '@/composables/transaction/mintCollection/utils'
import waifuApi from '@/services/waifu'

const { accountId } = useAuth()
const { client } = usePrefix()
const { apiInstance } = useApi()
const { nextCollectionId } = useStatemineNewCollectionId()
const { howAboutToExecute, status, isError } = useMetaTransaction()
const { $consola } = useNuxtApp()
const route = useRoute()
const router = useRouter()

const to = route.query.destination as Prefix
const from = route.query.source as Prefix
const fromAccountId = route.query.accountId?.toString()
const collectionOwner = route.query.collectionOwner?.toString()

const api = await apiInstance.value
const { steps, updateSteps } = inject('steps') as {
  steps: Ref<Steps>
  updateSteps: (step: Steps) => void
}

const nextId = ref('0')
const relocationsBody = ref({})

const ITERATIONS = 2
const step1Iterations = ref(ITERATIONS)

const { collections } = await useCollectionReady(from, fromAccountId)
const fromCollection = collections.value.find(
  (collection) => collection.id === route.query.collectionId,
)

const startStep1 = async () => {
  step1Iterations.value -= 1
  nextId.value = (await nextCollectionId())?.toString() || '0'
  relocationsBody.value = {
    from: {
      chain: from,
      collection: fromCollection?.id,
    },
    to: {
      chain: to,
      collection: nextId.value,
    },
    issuer: fromAccountId, // accountId.value
  }

  if (nextId.value && fromCollection?.metadata) {
    const createArgs = createArgsForNftPallet(accountId.value)

    const cb = api.tx.utility.batch
    const args = [
      [
        api.tx.nfts.create(...createArgs),
        api.tx.nfts.setCollectionMetadata(
          nextId.value,
          fromCollection.metadata,
        ),
        api.tx.nfts.setTeam(
          nextId.value,
          KODA_BOT,
          accountId.value,
          accountId.value,
        ),
      ],
    ]

    await howAboutToExecute(accountId.value, cb, args)

    updateSteps('step1-check-id')
  }
}

const validationStep1 = async () => {
  step1Iterations.value -= 1

  router.push({
    query: {
      ...route.query,
      nextCollectionId: nextId.value,
    },
  })

  try {
    await waifuApi('/relocations', {
      method: 'POST',
      body: relocationsBody.value,
    })

    updateSteps('step2')
  } catch (error) {
    $consola.error(error)
  }
}

async function checkCollection() {
  useSubscriptionGraphql({
    query: `
      collection: collectionEntityById(id: "${nextId.value}") {
        id
        burned
      }
    `,
    onChange: ({ data }) => {
      $consola.info({ collectionId: data.collection })

      if (data.collection?.id && step1Iterations.value) {
        validationStep1()
      }
    },
  })
}

function tryAgain() {
  updateSteps('step1')
  step1Iterations.value = ITERATIONS
}

watchEffect(async () => {
  $consola.info(
    'SignLoader1.vue',
    steps.value,
    step1Iterations.value,
    status.value,
    isError.value,
  )

  if (steps.value === 'step1' && step1Iterations.value) {
    startStep1()
  }

  // make sure collection exist before to validationStep1()
  if (
    steps.value === 'step1-check-id' &&
    status.value === TransactionStatus.Finalized
  ) {
    await checkCollection()
  }
})

const whichIcon = () => {
  if (isError.value || status.value === TransactionStatus.Cancelled) {
    return iconError
  }

  if (step1Iterations.value === 0) {
    return iconSuccess
  }

  if (step1Iterations.value < ITERATIONS) {
    return iconLoading
  }

  return iconIdle
}
</script>
