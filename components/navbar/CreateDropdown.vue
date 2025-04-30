<template>
  <div>
    <div
      data-testid="classic"
      class="navbar-item"
      @click="handleButtonClick"
    >
      {{ $t('create') }}
    </div>
    <CreateEntryModal
      v-model="isModalActive"
    />
  </div>
</template>

<script lang="ts" setup>
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
