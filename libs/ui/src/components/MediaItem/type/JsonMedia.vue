<template>
  <div>
    <div
      v-for="item in items"
      :key="item.key"
    >
      <div class="py-3">
        <b>{{ item.key }}</b>: {{ item.value }}
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'

const props = defineProps<{
  src?: string
}>()
const items = ref<{ key: string, value: string }[]>([])

onMounted(async () => {
  if (props.src) {
    items.value = [
      { key: 'src', value: props.src },
    ]
  }
})
</script>
