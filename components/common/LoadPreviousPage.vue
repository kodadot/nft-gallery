<template>
  <a class="is-flex is-justify-content-center pb-4" @click="onClick">
    <NeoIcon icon="chevron-up" />
  </a>
</template>

<script lang="ts" setup>
import { NeoIcon } from '@kodadot1/brick'

const emit = defineEmits(['click'])
const onClick = (event) => {
  emit('click', event)
}
</script>
