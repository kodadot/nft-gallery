<template>
  <component :is="targetIs" ref="target" :class="targetClass" />

  <template v-if="targetIsVisible">
    <slot />
  </template>
</template>
<script lang="ts" setup>
withDefaults(
  defineProps<{
    targetIs?: string
    targetClass?: string
  }>(),
  {
    targetIs: 'div',
    targetClass: '',
  },
)

const target = ref<HTMLHtmlElement>()
const targetIsVisible = useOnceIsVisible(target)
</script>
