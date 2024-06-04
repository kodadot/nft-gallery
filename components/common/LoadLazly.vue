<template>
  <div ref="target" />

  <template v-if="targetIsVisible">
    <slot />
  </template>
</template>
<script lang="ts" setup>
const props = withDefaults(
  defineProps<{
    target?: HTMLHtmlElement
  }>(),
  {
    target: undefined,
  },
)

const target = ref<HTMLHtmlElement>()
const targetIsVisible = useOnceIsVisible(
  computed(() => props.target || target.value),
)
</script>
