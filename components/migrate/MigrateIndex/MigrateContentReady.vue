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
      <div v-for="cl in collections" :key="cl.id" class="collection-card">
        <div
          class="collection-card-banner"
          :style="{
            backgroundImage: `url(${sanitizeIpfsUrl(cl.meta?.image)})`,
          }"></div>
        <div
          class="collection-card-avatar"
          :style="{
            backgroundImage: `url(${sanitizeIpfsUrl(cl.meta?.image)})`,
          }"></div>

        <div class="collection-card-info">
          <div
            class="is-flex is-justify-content-space-between is-align-items-center">
            <div>
              <p class="is-size-5 has-text-weight-bold">
                {{ cl.name }}
              </p>
              <p>
                <span class="has-text-grey mr-2">
                  {{ $t('migrate.ready.status') }}
                </span>
                <span>
                  {{ cl.nftsOwned?.length }}/{{ cl.nfts?.length }} Items
                </span>
              </p>
            </div>
            <div>
              <NeoButton variant="pill" @click="toReview(cl.id)">
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

const { accountId } = useAuth()
const { client } = usePrefix()

defineProps<{
  toReview: (string) => void
}>()

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

const collections = ref<Collections['collectionEntities']>([])
const { data } = await useAsyncQuery<Collections>({
  query: gql`
    query collectionByAccount($account: String!) {
      collectionEntities(
        where: { currentOwner_eq: $account }
        orderBy: blockNumber_DESC
      ) {
        id
        name
        metadata
        meta {
          id
          image
          animationUrl
          name
          description
        }
        nftsOwned: nfts(
          where: { burned_not_eq: true, currentOwner_eq: $account }
        ) {
          id
        }
        nfts(where: { burned_not_eq: true }) {
          id
        }
      }
    }
  `,
  variables: {
    account: accountId.value,
  },
  clientId: client.value,
})

watchEffect(() => {
  if (data.value?.collectionEntities?.length) {
    console.log('collections', data.value?.collectionEntities)
    collections.value = data.value?.collectionEntities
  }
})
</script>
