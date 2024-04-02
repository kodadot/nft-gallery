export default () => {
  const { urlPrefix } = usePrefix()
  const { isRemark, isAssetHub } = useIsChain(urlPrefix)

  const { hasItems } = useHasRoute()

  const options = computed(() => {
    if (hasItems.value) {
      return isRemark.value
        ? [...NFT_SQUID_SORT_CONDITION_LIST, 'instance_ASC']
        : NFT_SQUID_SORT_CONDITION_LIST
    }

    return isAssetHub.value
      ? [...NFT_SQUID_SORT_COLLECTIONS, 'volume_DESC', 'highestSale_DESC']
      : NFT_SQUID_SORT_COLLECTIONS
  })

  return { options }
}
