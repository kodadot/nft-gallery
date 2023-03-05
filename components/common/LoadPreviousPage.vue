<template>
  <a class="is-flex is-justify-content-center pb-4" @click="onClick">
    <b-icon icon="chevron-up" />
  </a>
</template>

<script lang="ts" setup>
const emit = defineEmits(['click'])
const onClick = (event) => {
  emit('click', event)
}
</script>
