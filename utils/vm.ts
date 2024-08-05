import type { ChainVM, Prefix } from '@kodadot1/static'
import { chainPropListOf } from '@/utils/config/chain.config'

type PickByVmOptions = {
  key?: string
  vm?: ChainVM
  prefix?: Prefix
}

export const pickByVm = <T>(
  map: Partial<Record<ChainVM, T>>,
  { key, vm, prefix }: PickByVmOptions = {},
): T | undefined => {
  const { vm: currentVm } = useChain()
  let targetVm = vm ?? currentVm.value

  if (prefix) {
    targetVm = chainPropListOf(prefix).vm
  }

  const vmMap = map[targetVm]
  if (!vmMap) {
    return undefined
  }

  return key ? (vmMap as any)[key] : vmMap
}

export const execByVm = <T>(
  map: Partial<Record<ChainVM, () => T>>,
  options: PickByVmOptions = {},
): T | undefined => {
  const func = pickByVm<() => T>(map, options)
  return func ? func() : undefined
}
