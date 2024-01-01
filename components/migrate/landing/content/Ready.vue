<template>
  <div class="mt-8 pt-4">
    <div class="flex is-relative section-title">
      <img src="/migrate/state-ready.svg" alt="Ready" />
      <p>{{ $t('migrate.ready.title') }}</p>
    </div>

    <div class="has-text-grey mt-2">
      {{ $t('migrate.ready.desc') }}
    </div>

    <div v-if="Object.keys(entities).length" class="collection">
      <div
        v-for="collection in collections"
        :key="collection.id"
        class="collection-card"
        :class="{
          hidden: !entities[collection.id]?.id,
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
          <div class="flex justify-between items-center">
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
                @click="
                  toReview({
                    collectionId: collection.id,
                    itemCount: collection.nftsOwned?.length,
                  })
                ">
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

const { urlPrefix } = usePrefix()
const { collections } = await useCollectionReady()

const entities = reactive({})
watchEffect(async () => {
  collections.value.forEach(async (collection) => {
    const metadata = await getNftMetadata(
      collection as unknown as MinimalNFT,
      urlPrefix.value,
    )
    const migrated = await waifuApi(
      `/relocations/${urlPrefix.value}-${collection.id}`,
    )

    if (!migrated?.id && collection.nfts?.length) {
      entities[collection.id] = {
        ...metadata,
      }
    }
  })
})
</script>
