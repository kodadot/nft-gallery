<template>
  <div
    class="relative h-[14px] overflow-hidden bg-background-color border border-border-color rounded-[2.5rem]">
    <div
      v-if="value > 0"
      class="absolute left-[-1px] top-[-1px] h-full bg-current box-content border border-border-color rounded-[2.5rem]"
      :class="`w-[${width}%]`"></div>
  </div>
</template>

<script lang="ts" setup>
const props = withDefaults(
  defineProps<{
    value: number
  }>(),
  {
    value: 0,
  },
)

const width = computed(() => `${props.value * 100}%`)
</script>
