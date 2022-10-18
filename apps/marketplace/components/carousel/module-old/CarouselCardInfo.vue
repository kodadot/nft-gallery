<template>
  <div class="card-content px-4">
    <div class="media">
      <div class="media-content">
        <div class="title is-5 is-ellipsis has-text-weight-bold">
          <nuxt-link :to="urlOf({ id: list.id, url })">
            {{ list.name }}
          </nuxt-link>
        </div>
        <div v-if="list.collection" class="subtitle is-6 is-ellipsis">
          <nuxt-link :to="`/rmrk/collection/${list.collection.id}`">
            {{ list.collection.name }}
          </nuxt-link>
        </div>
        <nuxt-link :to="{ name: profileUrl, params: { id: list.issuer } }">
          <div class="is-size-7 icon-text">
            <b-icon icon="palette" />
            <Identity :address="list.issuer" class="force-clip is-ellipsis" />
          </div>
        </nuxt-link>
        <nuxt-link
          v-if="list.currentOwner"
          :to="{
            name: profileUrl,
            params: { id: list.currentOwner },
          }"
          data-cy="current-owner">
          <div class="is-size-7 icon-text">
            <b-icon icon="money-bill-alt" />
            <Identity
              :address="list.currentOwner"
              class="force-clip is-ellipsis" />
          </div>
        </nuxt-link>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { CarouselNFT } from '@/components/base/types'
import Identity from '@/components/identity/IdentityIndex.vue'

import { useCarouselUrl } from '../utils/useCarousel'

const { urlOf, profileUrl } = useCarouselUrl()
const url = inject('itemUrl') as string

defineProps<{
  list: CarouselNFT
}>()
</script>
