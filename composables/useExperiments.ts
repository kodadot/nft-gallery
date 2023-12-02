import { localStorage } from '@/services/browserAPIs'

export default function () {
  const { searchParams } = useRequestURL()

  const has = (key: string) =>
    searchParams.get(key) === 'true' || localStorage?.getItem(key) === 'true'

  return {
    redesign: computed(() => has('redesign')),
  }
}
