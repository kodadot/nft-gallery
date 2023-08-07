<template>
  <a
    class="navbar-item is-flex is-align-items-center"
    @click="toggleShoppingCartModal">
    <span v-if="props.showLabel">{{ $t('shoppingCart.label') }}</span>
    <div class="is-relative" :class="{ 'ml-2': showLabel }">
      <img :src="shoppingCartIcon" class="image is-24x24 align" />
      <ActiveCount
        v-if="numberOfItems"
        :count="numberOfItems"
        rounded
        class="count-position is-size-7" />
    </div>
  </a>
</template>

<script setup lang="ts">
const { shoppingCartIcon } = useShoppingCartIcon()
import {
  isShoppingCartOpen,
  openShoppingCart,
} from '@/components/common/shoppingCart/ShoppingCartModalConfig'
import ActiveCount from '../explore/ActiveCount.vue'
import { useShoppingCartStore } from '@/stores/shoppingCart'
const { urlPrefix } = usePrefix()

const shoppingCartStore = useShoppingCartStore()
const numberOfItems = computed(
  () => shoppingCartStore.getItemsByPrefix(urlPrefix.value).length
)

const props = defineProps<{
  showLabel: boolean
}>()
const emit = defineEmits(['closeBurgerMenu'])

const instance = getCurrentInstance()

function toggleShoppingCartModal() {
  emit('closeBurgerMenu')

  // can use the function in ShoppingCartModalConfig
  if (!isShoppingCartOpen()) {
    openShoppingCart(instance)
  }

  // close all modal
  document.querySelectorAll('.modal').forEach((modal) => {
    modal.__vue__?.$vnode?.context?.close()
    modal.remove()
  })
}
</script>

<style scoped lang="scss">
.count-position {
  right: -0.75rem;
  top: -0.75rem;
  left: unset;
  bottom: unset;
}

.align {
  display: inline-flex;
  vertical-align: middle;
}
</style>
