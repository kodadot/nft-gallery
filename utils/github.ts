const KODADOT_GITHUB_ISSUE_URLS = {
  GENERAL_BUG_REPORT:
    'https://github.com/kodadot/nft-gallery/issues/new?assignees=&labels=bug&projects=&template=bug.yml&title=Be+descriptive+and+short',
  ASSETHUBS_BUG_REPORT:
    'https://github.com/kodadot/nft-gallery/issues/new?assignees=&labels=A-statemint-ahp%2Cbug%2Cp2&projects=&template=bug_assetshub.yml&title=Be+descriptive+and+short',
}

export const getGithubReportUrl = (message: string): string => {
  const { urlPrefix } = usePrefix()
  const { isAssetHub } = useIsChain(urlPrefix)
  const { accountId } = useAuth()
  const { getRecentWallet } = useWalletStore()

  let url = KODADOT_GITHUB_ISSUE_URLS.GENERAL_BUG_REPORT

  if (isAssetHub.value) {
    url = KODADOT_GITHUB_ISSUE_URLS.ASSETHUBS_BUG_REPORT
  }

  const urlObject = new URL(url)
  urlObject.searchParams.set(
    'logs',
    `Url: ${window.location.href}\nBrowser: ${navigator.userAgent}\nWallet: ${getRecentWallet}\nChain: ${urlPrefix.value}\nError: ${message}`,
  )
  urlObject.searchParams.set('wallet_address', `Address: ${accountId.value}`)

  return urlObject.toString()
}
