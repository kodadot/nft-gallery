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

const { setUrlPrefix } = usePrefix()
const { accountId } = useAuth()
const { nextCollectionId } = useStatemineNewCollectionId()
const { apiInstance } = useApi()
const { howAboutToExecute, isLoading, status } = useMetaTransaction()
const route = useRoute()

const to = route.query.destination as Prefix
const from = route.query.source as Prefix

setUrlPrefix(to)

const { collections } = await useCollectionReady(from)
const fromCollection = collections.value.find(
  (collection) => collection.id === route.query.collectionId,
)

const steps = ref<'init' | 'step1' | 'step2' | 'step3'>('init')
const relocationsBody = ref({})

const signTransactions = async () => {
  steps.value = 'step1'

  const api = await apiInstance.value
  const nextId = await nextCollectionId()
  relocationsBody.value = {
    from: {
      chain: from,
      collection: fromCollection?.id,
    },
    to: {
      chain: to,
      collection: nextId,
    },
    issuer: accountId.value,
  }
  console.log(relocationsBody.value)

  if (nextId && fromCollection?.metadata) {
    const createArgs = createArgsForNftPallet(accountId.value)

    const cb = api.tx.utility.batch
    const args = [
      [
        api.tx.nfts.create(...createArgs),
        api.tx.nfts.setCollectionMetadata(nextId, fromCollection.metadata),
        api.tx.nfts.setTeam(nextId, KODA_BOT, accountId.value, accountId.value),
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

watchEffect(async () => {
  if (steps.value === 'step1' && status.value === 'loader.finalized') {
    const relocations = await waifuApi('/relocations', {
      method: 'POST',
      body: relocationsBody.value,
    })

    console.log({ relocations })
  }
})
</script>

<style scoped lang="scss">
@import '@/assets/styles/abstracts/variables';

.btn-submit {
  height: 3.5rem;
}
</style>
