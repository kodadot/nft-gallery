<template>
  <div class="is-flex mb-2 token-price-container">
    <div
      v-for="tab in tabs"
      :key="tab.value"
      class="token-price py-2 px-4 is-flex is-align-items-center is-clickable"
      :class="{
        'token-price__active': value === tab.value,
      }"
      @click="() => handleTabClick(tab.value)">
      <img class="mr-2 image square-20" :src="tab.icon" alt="token" />
      {{ tab.label }}
    </div>
  </div>
</template>

<script lang="ts" setup>
export type TransferTokenTab = {
  label: string
  value: string
  icon: string
}
defineProps<{
  tabs: TransferTokenTab[]
  value: string
}>()
const emit = defineEmits(['select'])

const handleTabClick = (value: string) => {
  emit('select', value)
}
</script>

<style lang="scss" scoped>
@import '@/styles/abstracts/variables';

.square-20 {
  width: 20px;
  height: 20px;
}

.token-price-container {
  gap: 10px;

  @media screen and (max-width: 1216px) {
    flex-wrap: wrap !important;
  }

  .token-price {
    border-radius: 3rem;

    @include ktheme() {
      background-color: theme('background-color');
      color: theme('text-color');
      border: 1px solid theme('card-border-color');

      &:hover {
        border: 1px solid theme('border-color');
      }
    }

    &__active {
      @include ktheme() {
        background-color: theme('background-color-inverse');
        color: theme('text-color-inverse');
        border: 1px solid theme('background-color-inverse');
      }
    }
  }
}
</style>
