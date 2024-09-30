import { find } from 'lodash'
import type { Abi } from '../types'

export const hasBatchMint = (abi: Abi): boolean => {
  return Boolean(find(abi, { type: 'function', name: 'safeBatchMint' }))
}
