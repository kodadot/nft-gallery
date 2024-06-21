export default () => {
  const { accountId } = useAuth()
  const { availableChains, availableChainsByVm } = useChain()

  return computed(() =>
    accountId.value ? availableChainsByVm.value : availableChains.value,
  )
}
