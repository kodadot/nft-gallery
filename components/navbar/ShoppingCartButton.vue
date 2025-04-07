<template>
  <div
    class="navbar-item flex items-center"
    @click="toggleShoppingCartModal"
  >
    <span v-if="props.showLabel">{{ $t('shoppingCart.label') }}</span>
    <div
      class="relative size-6"
      :class="{ 'ml-2': showLabel }"
    >
      <KIcon
        name="i-mdi:cart-outline"
        size="medium"
      />
      <ActiveCount
        v-if="numberOfItems"
        :count="numberOfItems"
        rounded
        class="right-[-0.5rem] top-[-0.5rem] left-[unset]! bottom-[unset]! text-xs"
      />
    </div>
    <KIcon
      v-if="isMobile"
      class="icon--right"
      name="i-mdi:chevron-right"
    />
  </div>
</template>

<script setup lang="ts">
import ActiveCount from '../explore/ActiveCount.vue'
import { ModalCloseType } from './types'
import { useShoppingCartStore } from '@/stores/shoppingCart'
import {
  isShoppingCartOpen,
  openShoppingCart,
} from '@/components/common/shoppingCart/ShoppingCartModalConfig'

const { urlPrefix } = usePrefix()
const { neoModal } = useProgrammatic()
const shoppingCartStore = useShoppingCartStore()
const numberOfItems = computed(
  () => shoppingCartStore.getItemsByPrefix(urlPrefix.value).length,
)

const props = defineProps<{
  showLabel: boolean
}>()

const emit = defineEmits(['closeBurgerMenu'])
const { isMobile, isMobileOrTablet } = useDevice()

const toggleShoppingCartModal = () => {
  if (isMobileOrTablet) {
    emit('closeBurgerMenu')
  }

  neoModal.closeAll()

  // can use the function in ShoppingCartModalConfig
  if (!isShoppingCartOpen()) {
    openShoppingCart({
      onClose: (type: ModalCloseType) => {
        if (isMobileOrTablet && type === ModalCloseType.BACK) {
          emit('closeBurgerMenu')
        }
      },
      ...(isMobile ? { animation: 'none' } : {}),
    })
  }
}
</script>

<style scoped lang="scss">
.align {
  display: inline-flex;
  vertical-align: middle;
}
</style>
