<template>
  <div>
    <div class="mt-5">{{ $t('migrate.signNotes') }}</div>
    <p class="mt-5 has-text-grey is-size-7">
      - Please do not exit this modal until transactions are complete -
    </p>
    <hr />
    <p class="is-size-7">
      <strong><NeoIcon icon="lightbulb" /> Tip</strong>: Look for popups from
      your wallet extension for signing.
    </p>

    <p class="my-5">Follow Steps:</p>

    <MigrateStepsSignLoader :steps="steps" :item-count="itemCount" />

    <NeoButton
      label="Sign all required transactions"
      variant="k-accent"
      class="mt-4 btn-submit"
      expanded
      :disabled="steps !== 'init'"
      @click="signTransactions()" />
  </div>
</template>

<script setup lang="ts">
import type { Prefix } from '@kodadot1/static'
import { TransactionStatus } from '#imports'
import { NeoButton, NeoIcon } from '@kodadot1/brick'
import { type Steps, useCollectionReady } from '@/components/migrate/utils'
import waifuApi from '@/services/waifu'

const { setUrlPrefix } = usePrefix()
const { accountId } = useAuth()
const { apiInstance } = useApi()
const { howAboutToExecute, status } = useMetaTransaction()
const route = useRoute()

const to = route.query.destination as Prefix
const from = route.query.source as Prefix
const fromAccountId = route.query.accountId?.toString()
const itemCount = route.query.itemCount?.toString()

setUrlPrefix(to)

const { collections } = await useCollectionReady(from, fromAccountId)
const fromCollection = collections.value.find(
  (collection) => collection.id === route.query.collectionId,
)

const steps = ref<Steps>('init')
provide('steps', {
  steps: readonly(steps),
  updateSteps: (step: Steps) => {
    steps.value = step
  },
})

const iterations = ref(0)
const batchPresigned = reactive({})

const api = await apiInstance.value

function calculateIterations(batchSize = 200) {
  const items = parseInt(itemCount || '0')

  if (items <= 0 || batchSize <= 0) {
    return 0
  }

  return Math.ceil(items / batchSize)
}

const signTransactions = async () => {
  steps.value = 'step1'
}

const onStep2 = async () => {
  steps.value = 'step2'
  iterations.value = calculateIterations()

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
  } catch (error) {
    console.error('error step2', error)
  }
}

const onStep3 = async (index = 0) => {
  steps.value = 'step3'
  status.value = TransactionStatus.Unknown

  const cb = api.tx.utility.batch
  const args = [toRaw(batchPresigned[index])]

  await howAboutToExecute(accountId.value, cb, args)

  // TODO: call onStep3() again based on iterations
}

// check before to step 3
watchEffect(() => {
  if (
    iterations.value &&
    iterations.value === Object.keys(batchPresigned).length
  ) {
    onStep3()
  }
})

// go to congrats page
watchEffect(() => {
  // TODO: burn items in previous chain
  console.log('Sign.vue', { steps: steps.value, status: status.value })

  if (steps.value === 'step2') {
    onStep2()
  }

  if (steps.value === 'step3' && status.value === TransactionStatus.Finalized) {
    // navigateTo({
    //   path: '/migrate/congrats',
    //   query: {
    //     ...route.query,
    //   },
    // })
    console.log('move to congrats page')
  }
})
</script>

<style scoped lang="scss">
@import '@/assets/styles/abstracts/variables';

.btn-submit {
  height: 3.5rem;
}
</style>
