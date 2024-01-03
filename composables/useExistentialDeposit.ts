import { existentialDeposit } from '@kodadot1/static'

export default function () {
  const { urlPrefix } = usePrefix()
  const chainExistentialDeposit = computed(
    () => existentialDeposit[urlPrefix.value],
  )
  return {
    chainExistentialDeposit,
  }
}
