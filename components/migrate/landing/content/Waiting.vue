<template>
  <div class="mt-8 pt-4">
    <div class="flex is-relative section-title">
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
        class="collection-card"
        :class="{ hidden: !entities[collection.id]?.migrated[0]?.issuer }">
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
          <p class="flex">
            <span class="has-text-grey mr-2">
              {{ $t('migrate.waiting.status') }}
            </span>
            <NuxtLink
              :to="`/${urlPrefix}/u/${
                entities[collection.id]?.migrated[0]?.issuer
              }`">
              <IdentityIndex
                :address="entities[collection.id]?.migrated[0]?.issuer" />
            </NuxtLink>
          </p>
        </div>

        <div class="collection-card-info">
          <div class="flex justify-between items-center">
            <div>
              <p
                v-dompurify-html="
                  $t('migrate.waiting.own', [collection.nfts?.length])
                "></p>
            </div>
            <div>
              <NeoButton
                variant="pill"
                @click="
                  toReview({
                    collectionId: collection.id,
                    itemCount: collection.nfts?.length,
                    collectionOwner:
                      entities[collection.id]?.migrated[0]?.issuer,
                    setDestination:
                      entities[collection.id]?.migrated[0]?.to_chain,
                  })
                ">
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
import { toReview, useWaitingItems } from '@/composables/useMigrate'

const { urlPrefix } = usePrefix()

const { entities, collections } = useWaitingItems()
</script>
