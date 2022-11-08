<template>
  <section v-if="nft" class="py-5">
    <div class="columns">
      <div class="column is-two-fifths">
        <BasicImage src="/placeholder.webp" />
      </div>
      <div class="column">
        <h1 class="title">{{ nft?.name }}</h1>
        <h2 class="subtitle">
          <nuxt-link :to="`/${urlPrefix}/collection/${nft?.collection.id}`">
            {{ nft?.collection.name }}
          </nuxt-link>
        </h2>

        <div class="is-flex is-flex-direction-row py-4">
          <div class="is-flex is-align-items-center mr-6">
            <Avatar :size="48" :value="nft?.issuer" class="mr-2" />
            <div class="px-3">
              <div class="has-text-grey is-size-7">
                {{ $t('creator') }}
              </div>
              <div class="has-text-weight-bold">
                <nuxt-link
                  :to="{
                    name: `${urlPrefix}-u-id`,
                    params: { id: nft?.issuer },
                  }">
                  <Identity :address="nft?.issuer" />
                </nuxt-link>
              </div>
            </div>
          </div>
          <div v-if="nft?.currentOwner" class="is-flex is-align-items-center">
            <Avatar :size="48" :value="nft?.currentOwner" class="mr-2" />
            <div class="px-3">
              <div class="has-text-grey is-size-7">
                {{ $t('owner') }}
              </div>
              <div class="has-text-weight-bold">
                <nuxt-link
                  :to="{
                    name: `${urlPrefix}-u-id`,
                    params: { id: nft?.currentOwner },
                  }">
                  <Identity :address="nft?.currentOwner" />
                </nuxt-link>
              </div>
            </div>
          </div>
        </div>

        <!-- LINE DIVIDER -->
        <hr />

        {{ nft }}
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { NftEntity } from '@/components/rmrk/service/types'

const BasicImage = defineAsyncComponent(
  () => import('@/components/shared/view/BasicImage.vue')
)
const Identity = defineAsyncComponent(
  () => import('@/components/identity/IdentityIndex.vue')
)

const { urlPrefix } = usePrefix()
const { $route } = useNuxtApp()
const { data } = useGraphql({
  queryPrefix: 'subsquid',
  queryName: 'nftById',
  variables: {
    id: $route.params.id,
  },
})
const nft = ref<NftEntity>()
watch(data, () => {
  if (data.value) {
    nft.value = data.value.nftEntity
  }
})
</script>
