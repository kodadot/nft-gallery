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
          <p class="is-size-5 has-text-weight-bold">{{ cl.name }}</p>
          <p>
            <span class="has-text-grey mr-2">
              {{ $t('migrate.waiting.status') }}
            </span>
            <a href="#!" class="has-text-k-blue">Another nice name </a>
          </p>
        </div>

        <div class="collection-card-info">
          <div
            class="is-flex is-justify-content-space-between is-align-items-center">
            <div>
              <p
                v-dompurify-html="
                  $t('migrate.waiting.own', [cl.nfts?.length])
                "></p>
            </div>
            <div>
              <NeoButton variant="pill" @click="toReview(cl.id)">
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

defineProps<{
  toReview: (string) => void
}>()

const { accountId } = useAuth()
const { client } = usePrefix()

type Collections = {
  collectionEntities?: {
    id: string
    name: string
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

const collections = ref<Collections['collectionEntities']>([])
const { data } = await useAsyncQuery<Collections>({
  query: gql`
    query collectionByAccount($account: String!) {
      collectionEntities(
        where: {
          nfts_some: { currentOwner_eq: $account }
          issuer_not_eq: $account
        }
      ) {
        id
        name
        nfts(where: { currentOwner_eq: $account }) {
          id
        }
        metadata
        meta {
          id
          image
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
    collections.value = data.value?.collectionEntities
  }
})
</script>
