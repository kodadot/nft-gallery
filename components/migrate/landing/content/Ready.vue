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
            backgroundImage: `url(${entities[collection.id]?.image})`,
          }"></div>
        <div
          class="collection-card-avatar"
          :style="{
            backgroundImage: `url(${entities[collection.id]?.image})`,
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
              <NeoButton
                variant="pill"
                @click="toReview(collection.id, collection.nftsOwned?.length)">
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
import { useCollectionReady } from '@/composables/useMigrate'

defineProps<{
  toReview: (string, number) => void
}>()

const { collections } = await useCollectionReady()

const { urlPrefix } = usePrefix()
const entities = reactive({})
watchEffect(() => {
  collections.value.forEach(async (collection) => {
    entities[collection.id] = await getNftMetadata(
      collection as unknown as MinimalNFT,
      urlPrefix.value,
    )
  })
})
</script>
