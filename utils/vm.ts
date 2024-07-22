import type { ChainVM, Prefix } from '@kodadot1/static'
import { chainPropListOf } from '@/utils/config/chain.config'

export const execByVm = <T>(
  map: Record<ChainVM, () => T>,
  {
    key,
    vm,
    prefix,
  }: {
    key?: string
    vm?: ChainVM
    prefix?: Prefix
  } = {},
) => {
  const { vm: currentVm } = useChain()
  let targetVm = vm ?? currentVm.value

  if (prefix) {
    targetVm = chainPropListOf(prefix).vm
  }

  const vmMap = map[targetVm]
  return key ? vmMap?.[key]?.() : vmMap?.()
}
