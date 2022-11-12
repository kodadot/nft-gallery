<template>
  <div>
    <div v-for="item in items" :key="item.key" class="columns">
      <div class="column">
        <b>{{ item.key }}</b
        >: {{ item.value }}
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import api from '@/utils/fetch'

const props = defineProps<{
  src?: string
}>()
const items = ref<{ key: string; value: string }[]>([])

onMounted(async () => {
  if (props.src) {
    const { data } = await api.get(props.src)

    items.value = Object.entries(data).map(([key, value]) => ({
      key,
      value: JSON.stringify(value),
    }))
  }
})
</script>
