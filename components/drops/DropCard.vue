<template>
  <div class="drop-card border card-border-color">
    <nuxt-link
      v-if="drop.collection && !isLoadingMeta"
      :to="`/${urlPrefix}/unlockable`">
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
            <div class="is-flex">
              <div class="mr-2 has-text-grey">
                {{ $t('activity.creator') }}:
              </div>
              <nuxt-link
                :to="`/${urlPrefix}/u/${drop.collection.issuer}`"
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
              <span>{{ drop.max - drop.minted }}/{{ drop.max }}</span>
            </div>
            <div class="is-flex is-flex-direction-column">
              <span class="has-text-grey">{{ $t('price') }}</span>
              <span>{{ price }}</span>
            </div>
          </div>
        </div>
      </div>
    </nuxt-link>

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

import type { Metadata } from '@/components/rmrk/service/scheme'
import { sum } from '@/utils/math'
import TimeTag from './TimeTag.vue'
import { Drop } from './useDrops'

const { urlPrefix } = usePrefix()
const isLoadingMeta = ref(false)

interface Props {
  drop: Drop
}

const props = defineProps<Props>()
const image = ref('')

const price = computed(() => {
  if (!props.drop?.collection) {
    return ''
  }

  const totalPrice = sum(
    (props.drop?.collection.nfts || []).map((nft) => Number(nft?.price || 0))
  )

  return totalPrice > 0 ? totalPrice : 'Free'
})

onMounted(async () => {
  if (!props.drop?.collection) {
    return
  }

  isLoadingMeta.value = true
  const metadata = (await processSingleMetadata(
    props.drop.collection.metadata
  )) as Metadata
  image.value = sanitizeIpfsUrl(
    metadata.image || metadata.thumbnailUri || metadata.mediaUri || ''
  )
  isLoadingMeta.value = false
})
</script>
<style scoped lang="scss">
@import '@/styles/abstracts/variables';

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
