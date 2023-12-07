import { $fetch } from 'ofetch'

export default function usePageViews() {
  const count = ref<number | null>(null)
  const route = useRoute()

  const cleanPath = computed(() => route.path.replace(/\/$/, ''))
  const counterApi = computed(() => `${URLS.koda.counter}/${cleanPath.value}`)

  onMounted(async () => {
    const rawCount = await $fetch(counterApi.value, {
      method: 'POST',
      responseType: 'text',
    })

    if (rawCount) {
      count.value = Number.parseInt(rawCount)
    }
  })

  return count
}
