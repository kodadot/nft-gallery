<template>
  <div class="flex justify-between">
    <div class="flex pr-2">
      <div>
        <BasicImage
          :src="avatar"
          :alt="nft?.name"
          class="border image is-48x48" />
      </div>

      <div class="flex flex-col justify-between ml-4 limit-width">
        <div
          class="has-text-weight-bold has-text-color line-height-1 no-wrap is-clipped ellipsis">
          {{ nft.name }}
        </div>
        <div class="line-height-1 no-wrap is-clipped ellipsis">
          {{ nft.collection?.name || nft.collection.id }}
        </div>
      </div>
    </div>

    <div class="flex items-end no-wrap line-height-1">
      <CommonTokenMoney :value="nft.price" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { parseNftAvatar } from '@/utils/nft'
import BasicImage from '@/components/shared/view/BasicImage.vue'
import { ShoppingCartItem } from '../shoppingCart/types'
import CommonTokenMoney from '@/components/shared/CommonTokenMoney.vue'

const avatar = ref<string>()

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

.limit-width {
  width: 170px;

  @include mobile {
    width: 100px;
  }
}

.ellipsis {
  text-overflow: ellipsis;
}

.line-height-1 {
  line-height: 1;
}
</style>
