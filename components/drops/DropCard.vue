<template>
  <div class="drop-card border card-border-color">
    <component
      :is="externalUrl ? 'a' : NuxtLink"
      v-if="drop.collection && !isLoadingMeta"
      rel="nofollow noopener noreferrer"
      :to="`/${correctUrlPrefix}/drops/${drop.alias}`">
      <div
        class="drop-card-banner"
        :style="{ backgroundImage: `url(${image})` }">
        <section class="h-full is-flex">
          <div
            class="is-flex is-justify-content-space-between p-6 w-full flex-direction align-items">
            <div class="avatar">
              <BasicImage
                :src="image"
                :alt="drop.collection.name"
                custom-class="avatar-image" />
            </div>

            <TimeTag :drop-start-time="drop.dropStartTime" />
          </div>
        </section>
      </div>
      <div class="py-5 px-6">
        <div
          class="is-flex is-justify-content-space-between flex-direction column-gap">
          <div class="is-flex is-flex-direction-column column-gap">
            <span class="has-text-weight-bold">{{ drop.collection.name }}</span>
            <div v-if="drop.collection.issuer" class="is-flex">
              <div class="mr-2 has-text-grey">
                {{ $t('activity.creator') }}:
              </div>
              <nuxt-link
                :to="`/${correctUrlPrefix}/u/${drop.collection.issuer}`"
                class="has-text-link">
                <IdentityIndex
                  ref="identity"
                  :address="drop.collection.issuer"
                  show-clipboard />
              </nuxt-link>
            </div>
          </div>
          <div class="is-flex justify-content-space-between" style="gap: 2rem">
            <div class="is-flex is-flex-direction-column">
              <span class="has-text-grey">Available</span>

              <span v-if="isFreeDrop"
                >{{ drop.max - drop.minted }}/{{ drop.max }}</span
              >
              <span v-else>{{ drop.minted }}/{{ drop.max }} </span>
            </div>
            <div class="is-flex is-flex-direction-column">
              <span class="has-text-grey">{{ $t('price') }}</span>
              <span v-if="isFreeDrop">{{ $t('free') }}</span>
              <Money
                v-else
                :value="drop.price"
                :prefix="overrideUrlPrefix"
                inline />
            </div>
          </div>
        </div>
      </div>
    </component>

    <template v-else>
      <NeoSkeleton no-margin :rounded="false" height="112px" />
      <CollectionDetail is-loading :nfts="[]" name="" />
    </template>
  </div>
</template>

<script setup lang="ts">
import { NeoSkeleton } from '@kodadot1/brick'
import { processSingleMetadata } from '@/utils/cachingStrategy'
import { sanitizeIpfsUrl } from '@/utils/ipfs'
import BasicImage from '@/components/shared/view/BasicImage.vue'
import Money from '@/components/shared/format/Money.vue'

import type { Metadata } from '@/components/rmrk/service/scheme'
import TimeTag from './TimeTag.vue'
import { Drop } from './useDrops'
import { Prefix } from '@kodadot1/static'
import { resolveComponent } from 'vue'

const NuxtLink = resolveComponent('NuxtLink')

const { urlPrefix } = usePrefix()
const isLoadingMeta = ref(false)

interface Props {
  drop: Drop
  overrideUrlPrefix?: Prefix
  dropUrl?: string
}

const props = defineProps<Props>()
const image = ref('')
const externalUrl = ref()

const correctUrlPrefix = computed(() => {
  return props.overrideUrlPrefix || urlPrefix.value
})

const isFreeDrop = computed(() => {
  return !Number(props.drop?.price)
})

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
  externalUrl.value = metadata.external_url || ''
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
</style>
