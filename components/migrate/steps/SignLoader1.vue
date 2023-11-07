<template>
  <div class="mb-5">
    <div class="is-flex is-align-items-center mb-4">
      <div class="mr-5">
        <NeoIcon v-bind="whichIcon()" class="fa-2x" />
      </div>
      <div>
        <p class="has-text-weight-bold">Initiation Phase</p>
        <p class="is-size-7 has-text-grey">
          Launching your journey with a first transaction that sets up
          everything needed on the new chain.
        </p>
      </div>
    </div>
    <div class="is-flex is-size-7">
      <div class="v-border"></div>
      <div class="mb-4">
        <p v-if="step1Iterations">{{ step1Iterations }}/2 Left</p>
        <p v-else>Done</p>
      </div>
    </div>
    <div class="is-flex is-size-7">
      <div class="v-border"></div>
      <div class="mb-4 is-flex">
        <div class="mr-4">
          <NeoIcon v-if="retry === 0" v-bind="iconSuccess" />
          <NeoIcon v-else-if="step1Iterations === 1" v-bind="iconLoading" />
          <NeoIcon v-else v-bind="iconIdle" />
        </div>
        <div>
          <p>Create Collection</p>
          <nuxt-link
            v-if="retry === 0"
            target="_blank"
            class="has-text-k-blue"
            :to="`/${client}/collection/${nextId}`">
            View Tx <NeoIcon icon="arrow-up-right" />
          </nuxt-link>
        </div>
      </div>
    </div>
    <div class="is-flex is-size-7">
      <div class="v-border"></div>
      <div class="mb-4 is-flex">
        <div class="mr-4">
          <NeoIcon v-if="step1Iterations === 0" v-bind="iconSuccess" />
          <NeoIcon v-else-if="retry === 0" v-bind="iconLoading" />
          <NeoIcon v-else v-bind="iconIdle" />
        </div>
        <div>
          <p>Automated Asset Preparation</p>
          <p>No Signature Needed</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Prefix } from '@kodadot1/static'
import { NeoIcon } from '@kodadot1/brick'
import {
  type Steps,
  iconIdle,
  iconLoading,
  iconSuccess,
  useCollectionReady,
} from '@/components/migrate/utils'
import { useStatemineNewCollectionId } from '@/composables/transaction/mintCollection/useNewCollectionId'
import { createArgsForNftPallet } from '@/composables/transaction/mintCollection/utils'
import waifuApi from '@/services/waifu'

const { accountId } = useAuth()
const { client } = usePrefix()
const { apiInstance } = useApi()
const { nextCollectionId } = useStatemineNewCollectionId()
const { howAboutToExecute, status } = useMetaTransaction()
const { $consola } = useNuxtApp()
const route = useRoute()

const to = route.query.destination as Prefix
const from = route.query.source as Prefix
const fromAccountId = route.query.accountId?.toString()

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

// TODO: error on orm side (kysely-d1)
// const deleteRelocations = async () => {
//   const relocationsId = `${from}-${fromAccountId}`
//   return await waifuApi(`/relocations/${relocationsId}`, {
//     method: 'DELETE',
//   })
// }

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

  // await deleteRelocations()

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

  try {
    await waifuApi('/relocations', {
      method: 'POST',
      body: relocationsBody.value,
    })
    updateSteps('step2')
  } catch (error) {
    $consola.log(error)
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
      $consola.log({ collectionId: data.collection })
      if (data.collection?.id) {
        validationStep1()
      }
    },
  })
}

watchEffect(async () => {
  $consola.log('SignLoader1.vue', steps.value, status.value)

  if (steps.value === 'step1') {
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
  if (step1Iterations.value === 0) {
    return iconSuccess
  }

  if (step1Iterations.value < ITERATIONS) {
    return iconLoading
  }

  return iconIdle
}
</script>
