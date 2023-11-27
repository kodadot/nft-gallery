<template>
  <div class="mt-8 pt-4">
    <div class="is-flex is-relative section-title">
      <img src="/migrate/state-waiting.svg" alt="Ready" />
      <p>{{ $t('migrate.waiting.title') }}</p>
    </div>

    <div class="has-text-grey mt-2">
      {{ $t('migrate.waiting.desc') }}
    </div>

    <div class="collection">
      <div
        v-for="collection in collections"
        :key="collection.id"
        class="collection-card">
        <div
          class="collection-card-banner"
          :style="{
            backgroundImage: `url(${entities[collection.id]?.image})`,
          }"></div>
        <div
          class="collection-card-avatar"
          :style="{
            backgroundImage: `url(${entities[collection.id]?.image})`,
          }"></div>

        <div class="collection-card-info">
          <p class="is-size-5 has-text-weight-bold">{{ collection.name }}</p>
          <p v-if="entities[collection.id]?.migrated[0]?.issuer" class="flex">
            <span class="has-text-grey mr-2">
              {{ $t('migrate.waiting.status') }}
            </span>
            <Avatar
              :value="entities[collection.id]?.migrated[0]?.issuer"
              :size="26"
              class="mr-2" />
          </p>
        </div>

        <div class="collection-card-info">
          <div
            class="is-flex is-justify-content-space-between is-align-items-center">
            <div>
              <p
                v-dompurify-html="
                  $t('migrate.waiting.own', [collection.nfts?.length])
                "></p>
            </div>
            <div v-if="entities[collection.id]?.migrated[0]?.issuer">
              <NeoButton
                variant="pill"
                @click="toReview(collection.id, collection.nfts?.length)">
                {{ $t('migrate.waiting.cta') }}
              </NeoButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { NeoButton } from '@kodadot1/brick'
import collectionMigrateWaiting from '@/queries/subsquid/general/collectionMigrateWaiting.graphql'
import waifuApi from '@/services/waifu'

defineProps<{
  toReview: (string, number) => void
}>()

const { accountId } = useAuth()
const { client } = usePrefix()

type Collections = {
  collectionEntities?: {
    id: string
    name: string
    currentOwner: string
    nfts?: {
      id: string
    }[]
    metadata: string
    meta?: {
      id: string
      image: string
    }
  }[]
}

const { data } = await useAsyncQuery<Collections>({
  query: collectionMigrateWaiting,
  variables: {
    account: accountId.value,
  },
  clientId: client.value,
})

const collections = computed(() => {
  if (data.value?.collectionEntities?.length) {
    return data.value?.collectionEntities
  }

  return []
})

const { urlPrefix } = usePrefix()
const entities = reactive({})
watchEffect(() => {
  collections.value.forEach(async (collection) => {
    const metadata = await getNftMetadata(
      collection as unknown as MinimalNFT,
      urlPrefix.value,
    )
    const migrated = await waifuApi(
      `/relocations/owners/${collection.currentOwner}`,
    )

    entities[collection.id] = {
      ...metadata,
      migrated: migrated.filter((item) => item.collection === collection.id),
    }
  })
})
</script>
