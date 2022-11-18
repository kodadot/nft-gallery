<template>
  <b-field v-if="options">
    <b-radio-button
      v-for="option in options"
      :key="option"
      :value="value"
      :native-value="option"
      type="is-primary"
      class="collection-radio-btn"
      @input="handleInput">
      <span>{{ option }}</span>
    </b-radio-button>
  </b-field>
</template>

<script setup lang="ts">
const emit = defineEmits(['input'])

const props = defineProps<{
  value: string
  options: string[]
}>()

const handleInput = (value: string) => {
  emit('input', value)
}
</script>
