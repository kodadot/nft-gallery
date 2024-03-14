<template>
  <img :src="placeholder" alt="placeholder" />
</template>

<script lang="ts" setup>
defineProps<{
  src?: string
}>()
const { placeholder } = useTheme()
</script>
