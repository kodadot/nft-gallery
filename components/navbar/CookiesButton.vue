<template>
  <a
    :class="['flex items-center', { 'navbar-item': isMobileDevice }]"
    @click="onClick"
  >
    {{ $t('profileMenu.configureCookies') }}
  </a>
</template>

<script lang="ts" setup>
import { isMobileDevice } from '@/utils/extension'

const emits = defineEmits(['select'])
const { openModal } = useCookies()

const onClick = () => {
  openModal()
  emits('select')
}
</script>
