<template>
  <div>
    <div
      v-if="drop.collection && !isLoadingMeta"
      class="drop-card border border-border-color">
      <component
        :is="externalUrl ? 'a' : NuxtLink"
        rel="nofollow noopener noreferrer"
        :to="`/${dropPrefix}/drops/${drop.alias}`">
        <div
          class="drop-card-banner"
          :style="{ backgroundImage: `url(${image})` }">
          <section class="h-full flex">
            <div
              class="flex justify-between p-6 w-full flex-direction align-items">
              <div class="avatar">
                <BasicImage
                  :src="image"
                  :alt="drop.collection.name"
                  custom-class="avatar-image" />
              </div>

              <TimeTag :drop-start-time="drop.dropStartTime" :ended="ended" />
            </div>
          </section>
        </div>
        <div class="py-5 px-6">
          <div class="flex justify-between flex-direction column-gap">
            <div class="flex flex-col column-gap is-ellipsis">
              <span class="has-text-weight-bold is-ellipsis">{{
                drop.collection.name
              }}</span>
              <div v-if="drop.collection.issuer" class="flex">
                <div class="mr-2 has-text-grey">
                  {{ $t('activity.creator') }}:
                </div>
                <nuxt-link
                  :to="`/${dropPrefix}/u/${drop.collection.issuer}`"
                  class="has-text-link">
                  <IdentityIndex
                    ref="identity"
                    :address="drop.collection.issuer"
                    show-clipboard />
                </nuxt-link>
              </div>
            </div>
            <div class="flex justify-content-space-between" style="gap: 2rem">
              <div class="flex flex-col">
                <div class="has-text-grey">
                  {{ $t('statsOverview.minted') }}
                </div>

                <div>{{ drop.minted }}/{{ drop.max }}</div>
              </div>
              <div class="flex flex-col">
                <span class="has-text-grey">{{ $t('price') }}</span>
                <span v-if="isFreeDrop">{{ $t('free') }}</span>
                <Money v-else :value="drop.price" :prefix="dropPrefix" inline />
              </div>
            </div>
          </div>
        </div>
      </component>
    </div>

    <DropsDropCardSkeleton v-else />
  </div>
</template>

<script setup lang="ts">
import { processSingleMetadata } from '@/utils/cachingStrategy'
import { sanitizeIpfsUrl } from '@/utils/ipfs'

import type { Metadata } from '@/components/rmrk/service/scheme'
import TimeTag from './TimeTag.vue'
import { Drop } from './useDrops'
import { resolveComponent } from 'vue'

const NuxtLink = resolveComponent('NuxtLink')

const isLoadingMeta = ref(false)

interface Props {
  drop: Drop
  dropUrl?: string
}

const props = defineProps<Props>()
const image = ref('')
const externalUrl = ref()

const dropPrefix = computed(() => props.drop.chain)
const isFreeDrop = computed(() => !Number(props.drop.price))
const ended = computed(() => props.drop.minted === props.drop.max)

onMounted(async () => {
  if (!props.drop?.collection) {
    return
  }

  isLoadingMeta.value = true
  const metadata = (await processSingleMetadata(
    props.drop.collection.metadata,
  )) as Metadata
  image.value = sanitizeIpfsUrl(
    metadata.image || metadata.thumbnailUri || metadata.mediaUri || '',
  )
  externalUrl.value = metadata.external_url?.match('kodadot')
    ? ''
    : metadata.external_url
  isLoadingMeta.value = false
})
</script>

<style scoped lang="scss">
@import '@/assets/styles/abstracts/variables';

.flex-direction {
  @include until(560) {
    flex-direction: column;
  }
}
.align-items {
  align-items: flex-end;
  @include until(560) {
    align-items: flex-start;
  }
}

.drop-card {
  a:hover {
    color: unset;
  }
  &:hover {
    .drop-card-banner {
      opacity: 0.85;
    }
    @include ktheme() {
      border-color: theme('border-color');
    }
  }
  &-banner {
    height: 17rem;
    background-size: cover;
    background-repeat: no-repeat;
  }
}

.column-gap {
  @include until(560) {
    gap: 1rem;
  }
}
.justify-content-space-between {
  @include until(460) {
    justify-content: space-between;
  }
}

.avatar {
  padding: 0.5rem;

  @include ktheme() {
    border: 1px solid theme('k-shade');
    background-color: theme('background-color');
  }

  &-image {
    display: block;
    width: 5.5rem;
    height: 5.5rem;
    border: 1px solid;
    @include ktheme() {
      border: 1px solid theme('k-shade');
    }
  }
}
// allow text to wrap on mobile
.is-ellipsis {
  @include mobile {
    white-space: unset;
  }
}
</style>
