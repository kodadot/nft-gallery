<template>
  <div
    class="border is-size-7 is-justify-content-center py-1 my-2 is-flex is-align-items-center fixed-width fixed-height"
    :class="getInteractionColor(interaction)">
    {{ interactionName }}
  </div>
</template>

<script setup lang="ts">
import { getInteractionColor } from './common'

defineProps<{
  interaction: string
  interactionName: string
}>()
</script>
