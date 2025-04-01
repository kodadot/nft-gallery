<template>
  <a
    class="flex justify-center pb-4"
    @click="onClick"
  >
    <KIcon name="i-mdi:chevron-up" />
  </a>
</template>

<script lang="ts" setup>
const emit = defineEmits(['click'])
const onClick = (event) => {
  emit('click', event)
}
</script>
