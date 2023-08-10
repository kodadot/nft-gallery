import { Prefix } from '@kodadot1/static'
import {
  createVisible,
  explorerVisible,
  hotVisible,
  massmintCreateVisible,
  salesVisible,
  seriesInsightVisible,
} from '@/utils/config/permision.config'

enum RedirectTypes {
  CHAIN_PREFIX_CHANGE = 'chain-prefix-change',
  STAY = 'stay',
}

enum PageType {
  PREFIX_EXPLORE_ITEMS = '{prefix}-explore-items',
  PREFIX_EXPLORE_COLLECTIBLES = '{prefix}-explore-collectibles',
  SALES = 'sales',
  HOT = 'hot',
  SERIES_INSIGHT = 'series-insight',
  BLOG = 'blog',
  BLOG_SLUG = 'blog-slug',
  PREFIX_MASSMINT = '{prefix}-massmint',
  PREFIX_MASSMINT_ONBOARDING = '{prefix}-massmint-onboarding',
  PREFIX_CLASSIC_CREATE = '{prefix}-create',
}

type RedirectPath = {
  path: string
  query?: {
    [key: string]: any
  }
}

const PageRedirectType: { [key in PageType]?: RedirectTypes } = {
  [PageType.PREFIX_EXPLORE_ITEMS]: RedirectTypes.CHAIN_PREFIX_CHANGE,
  [PageType.PREFIX_EXPLORE_COLLECTIBLES]: RedirectTypes.CHAIN_PREFIX_CHANGE,
  [PageType.SALES]: RedirectTypes.STAY,
  [PageType.HOT]: RedirectTypes.STAY,
  [PageType.SERIES_INSIGHT]: RedirectTypes.STAY,
  [PageType.BLOG]: RedirectTypes.STAY,
  [PageType.BLOG_SLUG]: RedirectTypes.STAY,
  [PageType.PREFIX_MASSMINT]: RedirectTypes.CHAIN_PREFIX_CHANGE,
  [PageType.PREFIX_MASSMINT_ONBOARDING]: RedirectTypes.CHAIN_PREFIX_CHANGE,
  [PageType.PREFIX_CLASSIC_CREATE]: RedirectTypes.CHAIN_PREFIX_CHANGE,
}

function getEnumKeyByValue<
  T extends { [key: string]: string },
  K extends keyof T
>(enumObject: T, value: string): K | undefined {
  return Object.keys(enumObject).find((key) => enumObject[key] === value) as K
}

const SpecialRedirectPageTypes: PageType[] = Object.keys(PageRedirectType)
  .map<PageType>((value) => getEnumKeyByValue(PageType, value) as PageType)
  .filter(Boolean) as PageType[]

const pageAvailabilityPerChain = {
  [PageType.PREFIX_EXPLORE_ITEMS]: (chain: Prefix): boolean =>
    explorerVisible(chain),
  [PageType.PREFIX_EXPLORE_COLLECTIBLES]: (chain: Prefix): boolean =>
    explorerVisible(chain),
  [PageType.SERIES_INSIGHT]: (chain: Prefix) => seriesInsightVisible(chain),
  [PageType.PREFIX_CLASSIC_CREATE]: (chain: Prefix) => createVisible(chain),
  [PageType.PREFIX_MASSMINT]: (chain: Prefix) => massmintCreateVisible(chain),
  [PageType.PREFIX_MASSMINT_ONBOARDING]: (chain: Prefix) =>
    massmintCreateVisible(chain),
  [PageType.SALES]: (chain: Prefix) => salesVisible(chain),
  [PageType.HOT]: (chain: Prefix) => hotVisible(chain),
}

const getPagaType = (routeName: string): PageType => {
  const matchingKey = Object.keys(PageType).find((key) => {
    const pattern = PageType[key].replace(/\{.*\}/, '.+').replace('-', '\\-')
    return new RegExp(`^${pattern}$`).test(routeName)
  })

  return matchingKey as PageType
}

export default function (allowRedirectIfCheckNotPresent = false) {
  const route = useRoute()

  const getChangedChainPrefixFromPath = (
    chain: Prefix,
    prevChain: Prefix
  ): RedirectPath => ({
    path: route.path.replace(prevChain, chain),
    query: route.query,
  })

  const checkIfPageHasSpecialRedirect = (pageType: PageType): boolean => {
    return SpecialRedirectPageTypes.includes(pageType as PageType)
  }

  const getPageRedirectPath = (
    newChain: Prefix,
    prevChain: Prefix,
    defaultRedirectPath: string
  ): RedirectPath | null => {
    const routeName = route.name || ''

    const defaultRedirect: RedirectPath = {
      path: defaultRedirectPath,
    }

    const pageType = getPagaType(routeName)

    const hasSpecialRedirect = checkIfPageHasSpecialRedirect(pageType)

    if (!hasSpecialRedirect) {
      return defaultRedirect
    }

    const pageTypeValue = PageType[pageType]
    const pageRedirectType = PageRedirectType[pageTypeValue]

    if (pageRedirectType === RedirectTypes.STAY) {
      return null
    }

    let isPageAvailableForChain = allowRedirectIfCheckNotPresent
    const pageAvailabilityCheck = pageAvailabilityPerChain[pageTypeValue]

    if (pageAvailabilityCheck) {
      isPageAvailableForChain = pageAvailabilityCheck(newChain)
    }

    if (!isPageAvailableForChain) {
      return defaultRedirect
    }

    if (pageRedirectType === RedirectTypes.CHAIN_PREFIX_CHANGE) {
      return getChangedChainPrefixFromPath(newChain, prevChain)
    }

    return null
  }

  const redirectAfterChainChange = (
    newChain: Prefix,
    prevChain: Prefix,
    defaultRedirect = `/${newChain}`
  ) => {
    const redirectPath = getPageRedirectPath(
      newChain,
      prevChain,
      defaultRedirect
    )

    if (!redirectPath) {
      return
    }

    navigateTo(redirectPath)
  }

  return {
    redirectAfterChainChange,
  }
}
