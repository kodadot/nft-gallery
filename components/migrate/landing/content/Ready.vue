<template>
  <div class="mt-8 pt-4">
    <div class="is-flex is-relative section-title">
      <img src="/migrate/state-ready.svg" alt="Ready" />
      <p>{{ $t('migrate.ready.title') }}</p>
    </div>

    <div class="has-text-grey mt-2">
      {{ $t('migrate.ready.desc') }}
    </div>

    <div v-if="collections.length" class="collection">
      <div
        v-for="collection in collections"
        :key="collection.id"
        class="collection-card"
        :class="{
          'collection-card-empty':
            !collection.nfts?.length || entities[collection.id]?.hide,
        }">
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
                @click="toReview(collection.id, collection.nfts?.length)">
                {{ $t('migrate.ready.cta') }}
              </NeoButton>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="text-center mt-8">
      <p class="is-size-4 has-text-weight-bold">Nothing to Migrate</p>
      <p>
        It looks like you have no collections or items ready for migration at
        this time.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { NeoButton } from '@kodadot1/brick'
import { toReview, useCollectionReady } from '@/composables/useMigrate'
import waifuApi from '@/services/waifu'

const { accountId } = useAuth()
const { collections } = await useCollectionReady()

const { urlPrefix } = usePrefix()
const entities = reactive({})
watchEffect(async () => {
  const migrated = await waifuApi(`/relocations/owners/${accountId.value}`)

  collections.value.forEach(async (collection) => {
    const metadata = await getNftMetadata(
      collection as unknown as MinimalNFT,
      urlPrefix.value,
    )
    const hide = migrated?.some((item) => {
      return item.collection === collection.id
    })

    entities[collection.id] = {
      ...metadata,
      hide,
    }
  })
})
</script>
