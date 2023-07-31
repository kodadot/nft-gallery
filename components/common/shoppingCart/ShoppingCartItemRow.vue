<template>
  <div
    ref="hoverRef"
    class="is-flex is-justify-content-space-between py-2 px-6 shopping-cart-item">
    <div class="is-flex is-flex-grow-1 pr-2">
      <nuxt-link :to="`/${urlPrefix}/gallery/${nft.id}`" class="image is-48x48">
        <BasicImage :src="avatar" :alt="nft?.name" class="border" />
      </nuxt-link>
      <div
        class="is-flex is-flex-direction-column is-justify-content-space-between ml-4">
        <nuxt-link
          :to="`/${urlPrefix}/gallery/${nft.id}`"
          class="has-text-weight-bold line-height-1"
          >{{ nft.name }}</nuxt-link
        >
        <span class="line-height-1 no-wrap is-clipped">{{
          nft.collection?.name || nft.collection.id
        }}</span>
      </div>
    </div>

    <div
      v-if="allowDelete && isHovered"
      class="is-flex is-justify-content-end is-align-items-center">
      <NeoButton
        variant="text"
        class="inherit-background-color"
        no-shadow
        icon="trash"
        icon-pack="far"
        @click.native="emit('delete', nft.id)" />
    </div>

    <div v-else class="is-flex is-align-items-end no-wrap line-height-1">
      <Money :value="nft.price" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { parseNftAvatar } from '@/utils/nft'
import BasicImage from '@/components/shared/view/BasicImage.vue'
import Money from '@/components/shared/format/Money.vue'
import { useElementHover } from '@vueuse/core'
import { NeoButton } from '@kodadot1/brick'
import { ShoppingCartItem } from './types'

const { urlPrefix } = usePrefix()
const hoverRef = ref()
const isHovered = useElementHover(hoverRef)
const emit = defineEmits(['delete'])

const props = defineProps<{
  nft: ShoppingCartItem
  allowDelete?: boolean
}>()

const getAvatar = async () => {
  if (props.nft) {
    avatar.value = await parseNftAvatar(props.nft)
  }
}

const avatar = ref<string>()
onMounted(() => {
  getAvatar()
})
</script>

<style scoped lang="scss">
@import '@/styles/abstracts/variables';

.shopping-cart-item {
  &:hover {
    @include ktheme() {
      background-color: theme('k-accentlight2');
    }
  }
}

.line-height-1 {
  line-height: 1;
}

.inherit-background-color {
  background-color: inherit !important;
}
</style>
