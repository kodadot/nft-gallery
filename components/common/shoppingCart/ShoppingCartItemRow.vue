<template>
  <div ref="hoverRef" class="flex justify-between background-hover">
    <div class="pr-2 w-full whitespace-nowrap is-clipped ellipsis">
      <div class="flex">
        <nuxt-link
          :to="`/${urlPrefix}/gallery/${nft.id}`"
          @click="emit('click-item')">
          <BasicImage
            :src="avatar"
            :alt="nft?.name"
            class="border image is-48x48" />
        </nuxt-link>
        <div
          class="flex flex-col justify-between ml-4 min-width w-full line-height-1">
          <nuxt-link
            :to="`/${urlPrefix}/gallery/${nft.id}`"
            class="has-text-weight-bold has-text-color whitespace-nowrap is-clipped ellipsis"
            @click="emit('click-item')">
            {{ nft.name }}
          </nuxt-link>
          <div class="flex justify-between w-full">
            <div class="whitespace-nowrap is-clipped ellipsis">
              {{ nft.collection?.name || nft.collection.id }}
            </div>

            <div :class="[{ hidden: isHovered }, 'ml-2']">
              <CommonTokenMoney :value="nft.price" :round="2" />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="isHovered" class="flex justify-end self-center h-full ml-2">
      <NeoButton
        variant="text"
        class="inherit-background-color"
        no-shadow
        icon="trash"
        @click="emit('delete', nft.id)" />
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
const emit = defineEmits(['delete', 'click-item'])

const props = defineProps<{
  nft: ShoppingCartItem
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
@import '@/assets/styles/abstracts/variables';

.background-hover {
  &:hover {
    @include ktheme() {
      background-color: theme('k-accentlight2');
    }
  }
}

.min-width {
  min-width: 0;
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
.hidden {
  opacity: 0;
}
</style>
