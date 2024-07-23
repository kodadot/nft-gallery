import type { ChainVM, Prefix } from '@kodadot1/static'
import { chainPropListOf } from '@/utils/config/chain.config'

type PickByVmOptions = {
  key?: string
  vm?: ChainVM
  prefix?: Prefix
}

export const pickByVm = <T>(
  map: Record<ChainVM, T>,
  { key, vm, prefix }: PickByVmOptions = {},
) => {
  const { vm: currentVm } = useChain()
  let targetVm = vm ?? currentVm.value

  if (prefix) {
    targetVm = chainPropListOf(prefix).vm
  }

  const vmMap = map[targetVm]
  return key ? vmMap?.[key] : vmMap
}

export const execByVm = <T>(
  map: Record<ChainVM, () => T>,
  { key, vm, prefix }: PickByVmOptions = {},
) => {
  return pickByVm(map, { key, vm, prefix })?.()
}
