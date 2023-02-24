<template>
  <component
    :is="separated ? 'div' : 'b-field'"
    v-if="options"
    :class="{ 'columns is-multiline': separated }">
    <b-radio-button
      v-if="showEmpty"
      :value="value"
      native-value=""
      type="is-primary"
      class="collection-radio-btn"
      :class="{ 'column is-half': separated }"
      @input="handleInput">
      <span><b>NONE</b></span>
    </b-radio-button>
    <b-radio-button
      v-for="option in options"
      :key="option"
      :value="value"
      :native-value="option"
      type="is-primary"
      class="collection-radio-btn"
      :class="{ 'column is-half': separated }"
      @input="handleInput">
      <span>{{ option }}</span>
    </b-radio-button>
  </component>
</template>

<script setup lang="ts">
defineProps<{
  value: string
  options: string[]
  showEmpty?: boolean
  separated?: boolean
}>()

const emit = defineEmits(['input'])
const handleInput = (value: string) => {
  emit('input', value)
}
</script>
