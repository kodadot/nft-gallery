<template>
  <div class="collection-card card">
    <nuxt-link
      v-if="drop.collection && !isLoadingMeta"
      :to="`/${urlPrefix}/unlockable`">
      <div
        class="collection-banner card-height cover"
        :style="{ backgroundImage: `url(${image})` }">
        <div class="collection-banner-shadow" />
        <section class="h-full is-flex">
          <div
            class="is-align-items-end is-flex is-justify-content-space-between my-6 px-6 w-full"
            :class="{
              'is-flex-direction-column is-align-items-self-start':
                variant !== 'large',
            }">
            <div class="avatar">
              <img v-if="image" :src="image" :alt="drop.collection.name" />
              <img v-else :src="placeholder" />
            </div>
            <TimeTag class="" :drop-start-time="drop.dropStartTime" />
          </div>
        </section>
      </div>
      <div class="p-5">
        <div
          class="is-flex is-justify-content-space-between"
          :class="{
            'is-flex-direction-column column-gap': variant !== 'large',
          }">
          <div
            class="is-flex is-flex-direction-column"
            :class="{
              'column-gap': variant !== 'large',
            }">
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
          <div
            class="is-flex"
            :class="{
              'is-justify-content-space-between': variant == 'small',
            }"
            style="gap: 2rem">
            <div class="is-flex is-flex-direction-column">
              <span class="has-text-grey">Available</span>
              <span>{{ drop.minted }}/{{ drop.max }}</span>
            </div>
            <div class="is-flex is-flex-direction-column">
              <span class="has-text-grey">Price</span>
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

import type { Metadata } from '@/components/rmrk/service/scheme'
import { sum } from '@/utils/math'
import TimeTag from './TimeTag.vue'
import { Drop } from './useDrops'

const { urlPrefix } = usePrefix()
const isLoadingMeta = ref(false)
const { placeholder } = useTheme()

interface Props {
  drop: Drop
  variant: 'large' | 'medium' | 'small'
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

  return totalPrice > 0 ? `${totalPrice}` : 'Free'
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

.card-height {
  height: 17rem;
}
.column-gap {
  gap: 1rem;
}
.cover {
  background-size: cover;
  background-repeat: no-repeat;
}

.avatar {
  padding: 0.75rem;

  @include ktheme() {
    border: 1px solid theme('k-shade');
    background-color: theme('background-color');
  }

  img {
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
