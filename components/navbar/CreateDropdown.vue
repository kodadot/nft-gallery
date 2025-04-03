<template>
  <div>
    <div
      data-testid="classic"
      class="navbar-item"
      @click="handleButtonClick"
    >
      {{ $t('create') }}
    </div>
    <CreateModal
      v-model="isModalActive"
    />
  </div>
</template>

<script lang="ts" setup>
import CreateModal from '@/components/create/CreateModal.vue'

defineProps<{
  chain: string
}>()
const emit = defineEmits(['select'])

const isModalActive = ref(false)

const handleButtonClick = () => {
  isModalActive.value = true
  emit('select')
}
</script>
