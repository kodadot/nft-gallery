<template>
  <div
    v-if="!props.target"
    ref="target"
  />

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

const targetRef = ref<HTMLHtmlElement>()
const targetIsVisible = useOnceIsVisible(
  computed(() => props.target || targetRef.value),
)
</script>
