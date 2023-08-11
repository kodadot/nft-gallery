<template>
  <div ref="hoverRef" style="position: relative" class="background-hover">
    <div class="is-flex pr-2">
      <nuxt-link
        :to="`/${urlPrefix}/gallery/${nft.id}`"
        @click.native="emit('click-item')">
        <BasicImage
          :src="avatar"
          :alt="nft?.name"
          class="border image is-48x48" />
      </nuxt-link>

      <div
        class="is-flex is-flex-direction-column is-justify-content-space-between ml-4 width-100">
        <nuxt-link
          :to="`/${urlPrefix}/gallery/${nft.id}`"
          class="has-text-weight-bold has-text-color line-height-1 no-wrap is-clipped ellipsis"
          @click.native="emit('click-item')">
          {{ nft.name }}
        </nuxt-link>
        <div class="is-flex is-justify-content-space-between">
          <div class="line-height-1 no-wrap is-clipped ellipsis">
            {{ nft.collection?.name || nft.collection.id }}
          </div>
          <div
            v-if="!isHovered"
            class="ml-2 is-flex is-align-items-end no-wrap line-height-1">
            <CommonTokenMoney :value="nft.price" />
          </div>
        </div>
      </div>
    </div>

    <div v-if="isHovered" style="position: absolute; top: 25px; right: 50px">
      <NeoButton
        variant="text"
        class="inherit-background-color"
        no-shadow
        icon="trash"
        icon-pack="far"
        @click.native="emit('delete', nft.id)" />
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
@import '@/styles/abstracts/variables';

.background-hover {
  &:hover {
    @include ktheme() {
      background-color: theme('k-accentlight2');
    }
  }
}

.width-100 {
  width: 100%;
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
