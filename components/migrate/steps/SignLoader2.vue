<template>
  <div class="mb-5">
    <div class="is-flex is-align-items-center mb-4">
      <div class="mr-5">
        <NeoIcon v-if="iterations === 0" v-bind="iconSuccess" class="fa-2x" />
        <NeoIcon
          v-else-if="steps.includes('step2')"
          v-bind="iconLoading"
          class="fa-2x" />
        <NeoIcon v-else v-bind="iconIdle" class="fa-2x" />
      </div>
      <div>
        <p class="has-text-weight-bold">Migrating your items</p>
        <p class="is-size-7 has-text-grey">
          You will now sign transactions to migrate NFTs you own.
        </p>
      </div>
    </div>
    <div class="is-flex is-size-7">
      <div class="v-border"></div>
      <div class="mb-4">
        <p v-if="iterations">{{ iterations }}/{{ maxIterations }} Left</p>
        <p v-else>Done</p>
      </div>
    </div>
    <div class="is-flex is-size-7">
      <div class="v-border"></div>
      <div
        v-for="(iteration, index) in maxIterations"
        :key="index"
        class="mb-4 is-flex">
        <!-- <NeoIcon v-bind="iconIdle" class="mr-4" /> -->
        <div>
          <p>Migrating {{ itemCount }} Items</p>
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
  calculateIterations,
  iconIdle,
  iconLoading,
  iconSuccess,
  useCollectionReady,
} from '@/components/migrate/utils'
import waifuApi from '@/services/waifu'

const { accountId } = useAuth()
const { apiInstance } = useApi()
const { howAboutToExecute, status } = useMetaTransaction()
const { $consola } = useNuxtApp()
const route = useRoute()

const from = route.query.source as Prefix
const fromAccountId = route.query.accountId?.toString()
const itemCount = route.query.itemCount?.toString()

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

const startStep2 = async () => {
  try {
    // eslint-disable-next-line no-restricted-syntax
    for (let index = 0; index < iterations.value; index++) {
      // TODO: proper api call
      let checkSign
      if (location.host.includes('localhost')) {
        checkSign = await waifuApi(
          `/relocations/${from}/${fromCollection?.id}/owners/${accountId.value}`,
        )
        // const checkSign = await import('./mock-ksm-step2.json')
      } else {
        checkSign = await waifuApi(
          `/relocations/${from}/${fromCollection?.id}/iterations/${index}`,
          {
            method: 'PUT',
          },
        )
      }

      const presigned = checkSign.data.map((item) => {
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

    executeStep2()
  } catch (error) {
    console.error('error step2', error)
  }
}

const executeStep2 = async (index = 0) => {
  updateSteps('step2-migrate')
  status.value = TransactionStatus.Unknown

  const cb = api.tx.utility.batch
  const args = [toRaw(batchPresigned[index])]

  await howAboutToExecute(accountId.value, cb, args)

  // TODO: call executeStep2() again based on iterations
}

watchEffect(() => {
  $consola.log('SignLoader2.vue', steps?.value, status.value)

  if (steps.value === 'step2') {
    startStep2()
  }

  if (
    steps.value === 'step2-migrate' &&
    status.value === TransactionStatus.Finalized
  ) {
    iterations.value -= 1

    if (iterations.value === 0) {
      updateSteps('step3')
    }
  }
})
</script>
