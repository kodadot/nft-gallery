<template>
  <div>
    <div v-for="item in data" :key="item.key">
      <div>
        <b>{{ item.key }}</b
        >: {{ item.value }}
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import api from '@/utils/fetch'

const { $consola } = useNuxtApp()
const props = defineProps<{
  src?: string
}>()
const data = ref<{ key: string; value: string }[]>([])

onMounted(async () => {
  if (props.src) {
    const { data } = await api.get(props.src)
    $consola.log('data', data)
    data.forEach(([key, value]) => {
      data.push({
        key,
        value: JSON.stringify(value),
      })
    })
  }
})
</script>
