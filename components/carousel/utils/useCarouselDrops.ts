import { useDrops } from '@/components/drops/useDrops'

export default () => {
  const { drops, count } = useDrops()
  const isReady = computed(() => drops.value.length === count.value)

  return { drops, isReady }
}
