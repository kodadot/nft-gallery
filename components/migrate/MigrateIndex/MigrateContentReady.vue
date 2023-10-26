<template>
  <div class="mt-8 pt-4">
    <div class="is-flex is-relative section-title">
      <img src="/migrate/state-ready.svg" alt="Ready" />
      <p>{{ $t('migrate.ready.title') }}</p>
    </div>

    <div class="has-text-grey mt-2">
      {{ $t('migrate.ready.desc') }}
    </div>

    <div class="collection">
      <div
        v-for="collection in collections"
        :key="collection.id"
        class="collection-card"
        :class="{ 'collection-card-empty': !collection.nftsOwned?.length }">
        <div
          class="collection-card-banner"
          :style="{
            backgroundImage: `url(${sanitizeIpfsUrl(collection.meta?.image)})`,
          }"></div>
        <div
          class="collection-card-avatar"
          :style="{
            backgroundImage: `url(${sanitizeIpfsUrl(collection.meta?.image)})`,
          }"></div>

        <div class="collection-card-info">
          <div
            class="is-flex is-justify-content-space-between is-align-items-center">
            <div>
              <p class="is-size-5 has-text-weight-bold">
                {{ collection.name }}
              </p>
              <p>
                <span class="has-text-grey mr-2">
                  {{ $t('migrate.ready.status') }}
                </span>
                <span>
                  {{ collection.nftsOwned?.length }}/{{
                    collection.nfts?.length
                  }}
                  Items
                </span>
              </p>
            </div>
            <div>
              <NeoButton variant="pill" @click="toReview(collection.id)">
                {{ $t('migrate.ready.cta') }}
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
import collectionMigrateReady from '@/queries/subsquid/general/collectionMigrateReady.graphql'

defineProps<{
  toReview: (string) => void
}>()

const { accountId } = useAuth()
const { client } = usePrefix()

// fetch collections
type Collections = {
  collectionEntities?: {
    id: string
    name: string
    metadata: string
    meta?: {
      id: string
      image: string
      animationUrl: string
      name: string
      description: string
    }
    nftsOwned?: {
      id: string
    }[]
    nfts?: {
      id: string
    }[]
  }[]
}

const { data } = await useAsyncQuery<Collections>({
  query: collectionMigrateReady,
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
</script>
