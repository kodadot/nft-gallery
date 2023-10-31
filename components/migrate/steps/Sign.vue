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

    <!-- step 1 phase -->
    <div class="mb-5">
      <div class="is-flex is-align-items-center mb-4">
        <div class="mr-5"><NeoIcon v-bind="stepsIcon('step1')" /></div>
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
        <div class="mb-4">2/2 Left</div>
      </div>
      <div class="is-flex is-size-7">
        <div class="v-border"></div>
        <div class="mb-4 is-flex">
          <!-- <NeoIcon icon="circle" class="mr-4" /> -->
          <div>
            <p>Create Collection</p>
            <p>View Tx <NeoIcon icon="arrow-up-right" /></p>
          </div>
        </div>
      </div>
      <div class="is-flex is-size-7">
        <div class="v-border"></div>
        <div class="mb-4 is-flex">
          <!-- <NeoIcon icon="circle" class="mr-4" /> -->
          <div>
            <p>Automated Asset Preparation</p>
            <p>No Signature Needed</p>
          </div>
        </div>
      </div>
    </div>

    <!-- step 2 phase -->
    <div class="mb-5">
      <div class="is-flex is-align-items-center mb-4">
        <div class="mr-5"><NeoIcon v-bind="stepsIcon('step2')" /></div>
        <div>
          <p class="has-text-weight-bold">Migrating your items</p>
          <p class="is-size-7 has-text-grey">
            You will now sign transactions to migrate NFTs you own.
          </p>
        </div>
      </div>
      <div class="is-flex is-size-7">
        <div class="v-border"></div>
        <div class="mb-4">1/1 Left</div>
      </div>
      <div class="is-flex is-size-7">
        <div class="v-border"></div>
        <div class="mb-4 is-flex">
          <!-- <NeoIcon icon="circle" class="mr-4" /> -->
          <div>
            <p>Migrating {{ itemCount }} Items</p>
          </div>
        </div>
      </div>
    </div>

    <!-- step 3 phase -->
    <div class="mb-5">
      <div class="is-flex is-align-items-center mb-4">
        <div class="mr-5"><NeoIcon v-bind="stepsIcon('step3')" /></div>
        <div>
          <p class="has-text-weight-bold">Finalization</p>
          <p class="is-size-7 has-text-grey">
            Please authorize transactions to complete the NFT migration.
          </p>
        </div>
      </div>
      <div class="is-flex is-size-7">
        <div class="v-border"></div>
        <div class="mb-4">1/1 Left</div>
      </div>
      <div class="is-flex is-size-7">
        <div class="v-border"></div>
        <div class="mb-4 is-flex">
          <!-- <NeoIcon icon="circle" class="mr-4" /> -->
          <div>
            <p>Finalizing {{ itemCount }} Items</p>
          </div>
        </div>
      </div>
    </div>

    <p>isLoading: {{ isLoading }}</p>
    <p>status: {{ status }}</p>

    <NeoButton
      label="Sign all required transactions"
      variant="k-accent"
      class="mt-4 btn-submit"
      expanded
      :disabled="steps !== 'init'"
      @click="signTransactions()" />

    <hr />
    <button @click="mockStep1()">mock step 1</button>
  </div>
</template>

<script setup lang="ts">
import type { Prefix } from '@kodadot1/static'
import { NeoButton, NeoIcon } from '@kodadot1/brick'
import { useStatemineNewCollectionId } from '@/composables/transaction/mintCollection/useNewCollectionId'
import { createArgsForNftPallet } from '@/composables/transaction/mintCollection/utils'
import { useCollectionReady } from '@/components/migrate/utils'
import { KODA_BOT } from '@/utils/support'
import waifuApi from '@/services/waifu'
import resolveQueryPath from '@/utils/queryPathResolver'
import { DETAIL_TIMEOUT } from '@/utils/constants'
import { delay } from '@/utils/fetch'

const { setUrlPrefix, client } = usePrefix()
const { accountId } = useAuth()
const { nextCollectionId } = useStatemineNewCollectionId()
const { apiInstance } = useApi()
const { howAboutToExecute, isLoading, status } = useMetaTransaction()
const route = useRoute()

const to = route.query.destination as Prefix
const from = route.query.source as Prefix
const itemCount = route.query.itemCount?.toString()

setUrlPrefix(to)

const { collections } = await useCollectionReady(from)
const fromCollection = collections.value.find(
  (collection) => collection.id === route.query.collectionId,
)

type Steps = 'init' | 'step1' | 'step2' | 'step3'

const steps = ref<Steps>('init')
const relocationsBody = ref({})
const nextId = ref('0')

const stepsIcon = (step: Steps) => {
  const iconIdle = {
    icon: 'circle',
    class: 'fa-2x has-text-grey',
  }
  const iconLoading = {
    icon: 'spinner-third',
    class: 'fa-spin fa-2x',
  }
  const iconSuccess = {
    icon: 'check',
    class: 'fa-2x',
  }

  if (steps.value === 'step1') {
    return {
      step1: iconLoading,
      step2: iconIdle,
      step3: iconIdle,
    }[step]
  }

  if (steps.value === 'step2') {
    return {
      step1: iconSuccess,
      step2: iconLoading,
      step3: iconIdle,
    }[step]
  }

  if (steps.value === 'step3') {
    return {
      step1: iconSuccess,
      step2: iconSuccess,
      step3: iconLoading,
    }[step]
  }

  return iconIdle
}

const signTransactions = async () => {
  steps.value = 'step1'
  nextId.value = (await nextCollectionId())?.toString() || '0'

  const api = await apiInstance.value
  relocationsBody.value = {
    from: {
      chain: from,
      collection: fromCollection?.id,
    },
    to: {
      chain: to,
      collection: nextId.value,
    },
    issuer: accountId.value,
  }
  console.log(relocationsBody.value)

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
  }

  // navigateTo({
  //   path: '/migrate/congrats',
  //   query: {
  //     ...route.query,
  //   },
  // })
}

const retry = ref(10)
const newCollectionStatus = ref<'init' | 'ready'>('init')

type NftId = {
  collectionEntities?: {
    id: string
  }[]
}

async function checkCollection() {
  const query = await resolveQueryPath(client.value, 'collectionByIds')
  const { data }: { data: Ref<NftId> } = await useAsyncQuery({
    query: query.default,
    clientId: client.value,
    variables: {
      ids: [nextId.value],
    },
  })

  return data.value.collectionEntities?.[0]?.id
}

// TODO: don't forget to remove mockStep1
const mockStep1 = () => {
  status.value = 'loader.finalized'
  newCollectionStatus.value = 'ready'
  relocationsBody.value = {
    from: {
      chain: 'rmrk',
      collection: '2A82FB6C3DF4FA783E-HRYA7N1AEJM4L',
    },
    to: {
      chain: 'ahk',
      collection: '193',
    },
    issuer: 'DY4SQF2iD456tH89aQtz5wv1EV3BbSW8wKKuMcwbmXaj1pM',
  }
  steps.value = 'step1'
}

// function calculateIterations(batchSize = 200) {
//   const items = parseInt(itemCount || '0')

//   if (items <= 0 || batchSize <= 0) {
//     return 0
//   }

//   return Math.ceil(items / batchSize)
// }

watchEffect(async () => {
  console.log({ steps: steps.value, status: status.value })
  const step1 = steps.value === 'step1' && status.value === 'loader.finalized'

  // make sure collection exist
  if (step1 && newCollectionStatus.value === 'init' && retry.value) {
    await delay(DETAIL_TIMEOUT)
    const nftId = await checkCollection()
    console.log({ nftId })

    if (nftId) {
      newCollectionStatus.value = 'ready'
    } else {
      retry.value -= 1
    }
  }

  // post to /relocations after collection created
  if (step1 && newCollectionStatus.value === 'ready') {
    try {
      await waifuApi('/relocations', {
        method: 'POST',
        body: relocationsBody.value,
      })

      steps.value = 'step2'
    } catch (error) {
      console.log(error)
    }
  }

  // create pre signed items
  if (steps.value === 'step2') {
    try {
      // const iteration = calculateIterations()
      const checkSign = await waifuApi(
        `/relocations/rmrk/${fromCollection?.id}/iterations/0`,
        {
          method: 'PUT',
        },
      )

      console.log(checkSign)
      steps.value = 'step3'
    } catch (error) {
      console.error('error step2', error)
    }
  }
})
</script>

<style scoped lang="scss">
@import '@/assets/styles/abstracts/variables';

.btn-submit {
  height: 3.5rem;
}

.v-border {
  width: 1px;
  background-color: black;
  margin-left: 20px;
  margin-right: 41px;
}
</style>
