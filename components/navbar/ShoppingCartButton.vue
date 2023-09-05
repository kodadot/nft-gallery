<template>
  <div
    class="navbar-item is-flex is-align-items-center"
    @click="toggleShoppingCartModal">
    <span v-if="props.showLabel">{{ $t('shoppingCart.label') }}</span>
    <div class="is-relative" :class="{ 'ml-2': showLabel }">
      <img
        :src="shoppingCartIcon"
        class="image is-24x24 align"
        alt="open shopping cart" />
      <ActiveCount
        v-if="numberOfItems"
        :count="numberOfItems"
        rounded
        class="count-position is-size-7" />
    </div>
  </div>
</template>

<script setup lang="ts">
const { shoppingCartIcon } = useShoppingCartIcon()
import {
  isShoppingCartOpen,
  openShoppingCart,
} from '@/components/common/shoppingCart/ShoppingCartModalConfig'
import ActiveCount from '../explore/ActiveCount.vue'
import { ModalCloseType } from './types'
import { useShoppingCartStore } from '@/stores/shoppingCart'
const { urlPrefix } = usePrefix()

const { $neoModal } = useNuxtApp()
const shoppingCartStore = useShoppingCartStore()
const numberOfItems = computed(
  () => shoppingCartStore.getItemsByPrefix(urlPrefix.value).length
)

const props = defineProps<{
  showLabel: boolean
}>()

const instance = getCurrentInstance()

const emit = defineEmits(['closeBurgerMenu'])
const isMobile = ref(window.innerWidth < 1024)
const isMobileWithoutTablet = ref(window.innerWidth < 768)

function toggleShoppingCartModal() {
  if (isMobile.value) {
    emit('closeBurgerMenu')
  }

  $neoModal.closeAll()

  // can use the function in ShoppingCartModalConfig
  if (!isShoppingCartOpen()) {
    openShoppingCart(instance, {
      onClose: (type: ModalCloseType) => {
        if (isMobile.value && type === ModalCloseType.BACK) {
          emit('closeBurgerMenu')
        }
      },
      ...(isMobileWithoutTablet.value ? { animation: 'none' } : {}),
    })
  }
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
