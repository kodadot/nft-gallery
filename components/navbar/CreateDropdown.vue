<template>
  <CreateEntryModal>
    <div
      data-testid="classic"
      class="navbar-item"
      @click="handleButtonClick"
    >
      {{ $t('create') }}
    </div>
  </CreateEntryModal>
</template>

<script lang="ts" setup>
defineProps<{
  chain: string
}>()
const emit = defineEmits(['select'])

const handleButtonClick = () => {
  emit('select')
}
</script>
