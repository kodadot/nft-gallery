<template>
  <div class="flex flex-col gap-8 w-full">
    <div class="flex gap-2 items-center">
      <p class="text-xl font-bold">Curated Generative Drops</p>

      <NeoIcon icon="badge-check" pack="fass" class="text-k-accent" />
    </div>

    <DropsGrid
      :drops="curatedDrops"
      :loaded="loaded"
      :default-skeleton-count="4"
      skeleton-key="curated-drops-skeleton" />
  </div>
</template>
<script lang="ts" setup>
import { NeoIcon } from '@kodadot1/brick'
import { useDrops } from '@/components/drops/useDrops'
import collectionIds from '@/queries/subsquid/general/collectionIds.graphql'

const { urlPrefix, client } = usePrefix()
const { accountId } = useAuth()

const { drops, loaded } = useDrops({
  active: [true, false],
  chain: [urlPrefix.value],
  limit: 100,
})

const dropCollectionIds = computed(
  () => drops.value?.map((drop) => drop.collection.collection) || [],
)

const { data: ownedCollectionDrops } = useAsyncData(
  'drop-collection-ids',
  async () => {
    if (!loaded.value) {
      return []
    }

    const { data } = await useAsyncQuery({
      query: collectionIds,
      variables: {
        search: {
          id_in: dropCollectionIds.value,
          nfts_some: {
            currentOwner_eq: accountId.value,
            burned_eq: false,
          },
        },
      },
      clientId: client.value,
    })

    return data.value?.collectionEntities ?? []
  },
  {
    watch: [dropCollectionIds, urlPrefix],
    transform: (data) => data.map((collection) => collection.id),
  },
)

const curatedDrops = computed(() =>
  drops.value.filter((drop) =>
    ownedCollectionDrops.value.includes(drop.collection.collection),
  ),
)
</script>
