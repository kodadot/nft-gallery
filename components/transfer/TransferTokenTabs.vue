<template>
  <div class="is-flex mb-5">
    <div
      v-for="tab in tabs"
      :key="tab.value"
      class="token-price py-2 px-4 mr-2 is-flex is-align-items-center"
      :class="{
        'token-price__active': value === tab.value,
      }"
      @click="() => handleTabClick(tab.value)">
      <img class="mr-2 is-20x20" :src="tab.icon" alt="token" />
      {{ tab.label }}
    </div>
  </div>
</template>

<script lang="ts" setup>
type Tab = {
  label: string
  value: string
  icon: string
}
defineProps<{
  tabs: Tab[]
  value: string
}>()
const emit = defineEmits(['select'])

const handleTabClick = (value: string) => {
  emit('select', value)
}
</script>

<style lang="scss" scoped>
@import '@/styles/abstracts/variables';

.token-price {
  cursor: pointer;

  @include ktheme() {
    border-radius: 3rem;
    background-color: theme('background-color');
    color: theme('text-color');
    border: 1px solid theme('card-border-color');
  }

  &__active {
    @include ktheme() {
      background-color: theme('background-color-inverse');
      color: theme('text-color-inverse');
      border: 1px solid theme('background-color-inverse');
    }
  }
}
</style>
