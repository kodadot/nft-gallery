import { EntropyRange } from '@/composables/drop/useGenerativePreview'

export const getEntropyRange = (num: number, step = 64): EntropyRange => [
  step * num,
  step * (num + 1),
]
