<template>
  <div>
    <div class="mt-5">{{ $t('migrate.signNotes') }}</div>

    <hr />
    <p>
      TODO:
      https://github.com/kodadot/nft-gallery/issues/7562#issuecomment-1765884165
    </p>
    <hr />

    <p>isLoading: {{ isLoading }}</p>
    <p>status: {{ status }}</p>

    <NeoButton
      label="Sign all required transactions"
      variant="k-accent"
      class="mt-4 btn-submit"
      expanded
      :disabled="steps !== 'init'"
      @click="signTransactions()" />

    <button @click="mockStep1()">mock step 1</button>
  </div>
</template>

<script setup lang="ts">
import type { Prefix } from '@kodadot1/static'
import { NeoButton } from '@kodadot1/brick'
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

const steps = ref<'init' | 'step1' | 'step2' | 'step3'>('init')
const relocationsBody = ref({})
const nextId = ref('0')

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

function calculateIterations(batchSize = 200) {
  const items = parseInt(itemCount || '0')

  if (items <= 0 || batchSize <= 0) {
    return 0
  }
  return Math.floor(items / batchSize)
}

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
      const iteration = calculateIterations()
      const checkSign = await waifuApi(
        `/relocations/rmrk/${fromCollection?.id}/iterations/${iteration}`,
        {
          method: 'PUT',
        },
      )

      console.log(checkSign)
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
</style>
