<template>
  <div
    ref="hoverRef"
    class="is-flex is-justify-content-space-between shopping-cart-item">
    <div class="is-flex is-flex-grow-1 pr-2">
      <component
        :is="clickable ? 'nuxt-link' : 'div'"
        :to="`/${urlPrefix}/gallery/${nft.id}`">
        <BasicImage
          :src="avatar"
          :alt="nft?.name"
          class="border image is-48x48" />
      </component>

      <div
        class="is-flex is-flex-direction-column is-justify-content-space-between ml-4 limit-width">
        <component
          :is="clickable ? 'nuxt-link' : 'div'"
          :to="`/${urlPrefix}/gallery/${nft.id}`"
          class="has-text-weight-bold has-text-color line-height-1 no-wrap is-clipped ellipsis">
          {{ nft.name }}
        </component>
        <div class="line-height-1 no-wrap is-clipped ellipsis">
          {{ nft.collection?.name || nft.collection.id }}
        </div>
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
      <CommonTokenMoney :value="nft.price" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { parseNftAvatar } from '@/utils/nft'
import BasicImage from '@/components/shared/view/BasicImage.vue'
import { useElementHover } from '@vueuse/core'
import { NeoButton } from '@kodadot1/brick'
import { ShoppingCartItem } from './types'
import CommonTokenMoney from '@/components/shared/CommonTokenMoney.vue'

const { urlPrefix } = usePrefix()
const hoverRef = ref()
const avatar = ref<string>()
const isHovered = useElementHover(hoverRef)
const emit = defineEmits(['delete'])

const props = defineProps<{
  nft: ShoppingCartItem
  allowDelete?: boolean
  clickable?: boolean
}>()

const getAvatar = async () => {
  if (props.nft) {
    avatar.value = await parseNftAvatar(props.nft)
  }
}

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

.limit-width {
  max-width: 170px;
}

.ellipsis {
  text-overflow: ellipsis;
}

.line-height-1 {
  line-height: 1;
}

.inherit-background-color {
  background-color: inherit !important;
}
</style>
