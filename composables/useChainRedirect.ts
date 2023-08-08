import { Prefix } from '~~/libs/static/dist'
import {
  explorerVisible,
  seriesInsightVisible,
} from '@/utils/config/permision.config'

enum RedirectTypes {
  CHAIN_PREFIX_CHANGE = 'chain-prefix-change',
  STAY = 'stay',
}

export enum PageTypes {
  PREFIX_EXPLORE_ITEMS = 'prefix-explore-items',
  PREFIX_EXPLORE_COLLECTIBLES = 'prefix-explore-collectibles',
  SALES = 'sales',
  HOT = 'hot',
  SERIES_INSIGHT = 'series-insight',
  BLOG = 'blog',
  BLOG_SLUG = 'blog-slug',
  PREFIX_MASSMINT = 'prefix-massmint',
  PREFIX_MASSMINT_ONBOARDING = 'prefix-massmint-onboarding',
}

const SpecialRedirectPages = [
  PageTypes.PREFIX_EXPLORE_ITEMS,
  PageTypes.PREFIX_EXPLORE_COLLECTIBLES,
  PageTypes.SALES,
  PageTypes.HOT,
  PageTypes.SERIES_INSIGHT,
  PageTypes.BLOG,
  PageTypes.BLOG_SLUG,
  PageTypes.PREFIX_MASSMINT,
  PageTypes.PREFIX_MASSMINT_ONBOARDING,
]

const redirectType: { [key in PageTypes]?: RedirectTypes } = {
  [PageTypes.PREFIX_EXPLORE_ITEMS]: RedirectTypes.CHAIN_PREFIX_CHANGE,
  [PageTypes.PREFIX_EXPLORE_COLLECTIBLES]: RedirectTypes.CHAIN_PREFIX_CHANGE,
  [PageTypes.SALES]: RedirectTypes.STAY,
  [PageTypes.HOT]: RedirectTypes.STAY,
  [PageTypes.SERIES_INSIGHT]: RedirectTypes.STAY,
  [PageTypes.BLOG]: RedirectTypes.STAY,
  [PageTypes.BLOG_SLUG]: RedirectTypes.STAY,
  [PageTypes.PREFIX_MASSMINT]: RedirectTypes.CHAIN_PREFIX_CHANGE,
  [PageTypes.PREFIX_MASSMINT_ONBOARDING]: RedirectTypes.CHAIN_PREFIX_CHANGE,
}

const pageVisibilityPerChain = {
  [PageTypes.PREFIX_EXPLORE_ITEMS]: (chain: Prefix | string): boolean =>
    explorerVisible(chain),
  [PageTypes.PREFIX_EXPLORE_COLLECTIBLES]: (chain: Prefix | string): boolean =>
    explorerVisible(chain),
  [PageTypes.SERIES_INSIGHT]: (chain: Prefix | string) =>
    seriesInsightVisible(chain),
}

export default function () {
  const { urlPrefix } = usePrefix()

  const route = useRoute()

  const getChangedChainPrefixFromPath = (chain: string | Prefix) =>
    route.path.replace(urlPrefix.value, chain)

  const handleSpecialCaseRedirect: {
    [key in RedirectTypes]?: (chain: string | Prefix) => void
  } = {
    [RedirectTypes.CHAIN_PREFIX_CHANGE]: (chain: string | Prefix) =>
      navigateTo(getChangedChainPrefixFromPath(chain)),
  }

  const redirectAfterChainChange = (
    chain: string | Prefix,
    defaultPath: string
  ) => {
    const routeName = route.name || ''

    const isSpecialCase = SpecialRedirectPages.includes(routeName as PageTypes)

    let isPageAvailableForChain = true
    const pageVisibilityCheck = pageVisibilityPerChain[routeName]

    if (pageVisibilityCheck) {
      isPageAvailableForChain = pageVisibilityCheck(chain)
    }

    if (!(isSpecialCase && isPageAvailableForChain)) {
      navigateTo(defaultPath)
    }

    if (redirectType[routeName] === RedirectTypes.STAY) {
      return
    }

    handleSpecialCaseRedirect[redirectType[routeName]](chain, routeName)
  }

  return {
    redirectAfterChainChange,
  }
}
