import { Prefix } from '@kodadot1/static'
import {
  createVisible,
  explorerVisible,
  hotVisible,
  identityVisible,
  massmintCreateVisible,
  profileVisible,
  salesVisible,
  seriesInsightVisible,
  transferVisible,
} from '@/utils/config/permision.config'

enum RedirectTypes {
  CHAIN_PREFIX_CHANGE = 'chain-prefix-change',
  STAY = 'stay',
  WALLET_ADDRESS_CHANGE = 'wallet-address-change',
}

const WALLET_PLACEHOLDER_NAME = 'wallet'
const PREFIX_PLACEHOLDER_NAME = 'prefix'

/**
 * Enum representing different page types for routing and matching.
 * You can use placeholders using curly braces {} for dynamic parts.
 * For example, '{prefix}-explore-items' contains a '{prefix}' placeholder
 * that {prefix} will be treated as any value for exmaple rmrk-explore-items
 */
enum PageType {
  PREFIX_EXPLORE_ITEMS = `/{${PREFIX_PLACEHOLDER_NAME}}/explore/items`,
  PREFIX_EXPLORE_COLLECTIBLES = `/{${PREFIX_PLACEHOLDER_NAME}}/explore/collectibles`,
  SALES = '/sales',
  HOT = '/hot',
  SERIES_INSIGHT = '/series-insight',
  BLOG = '/blog',
  BLOG_SLUG = '/blog/{slug}',
  PREFIX_MASSMINT = `/{${PREFIX_PLACEHOLDER_NAME}}/massmint`,
  PREFIX_MASSMINT_ONBOARDING = `/{${PREFIX_PLACEHOLDER_NAME}}/massmint/onboarding`,
  PREFIX_CLASSIC_CREATE = `/{${PREFIX_PLACEHOLDER_NAME}}/create`,
  PREFIX_TRANSFER = `/{${PREFIX_PLACEHOLDER_NAME}}/transfer`,
  IDENTITY = '/identity',
  PROFILE = `/{${PREFIX_PLACEHOLDER_NAME}}/u/{${WALLET_PLACEHOLDER_NAME}}`,
}

type RedirectPath = {
  path: string
  query?: {
    [key: string]: any
  }
}

const PageRedirectType: { [key in PageType]?: RedirectTypes[] } = {
  [PageType.PREFIX_EXPLORE_ITEMS]: [RedirectTypes.CHAIN_PREFIX_CHANGE],
  [PageType.PREFIX_EXPLORE_COLLECTIBLES]: [RedirectTypes.CHAIN_PREFIX_CHANGE],
  [PageType.SALES]: [RedirectTypes.STAY],
  [PageType.HOT]: [RedirectTypes.STAY],
  [PageType.SERIES_INSIGHT]: [RedirectTypes.STAY],
  [PageType.BLOG]: [RedirectTypes.STAY],
  [PageType.BLOG_SLUG]: [RedirectTypes.STAY],
  [PageType.PREFIX_MASSMINT]: [RedirectTypes.CHAIN_PREFIX_CHANGE],
  [PageType.PREFIX_MASSMINT_ONBOARDING]: [RedirectTypes.CHAIN_PREFIX_CHANGE],
  [PageType.PREFIX_CLASSIC_CREATE]: [RedirectTypes.CHAIN_PREFIX_CHANGE],
  [PageType.PREFIX_TRANSFER]: [RedirectTypes.CHAIN_PREFIX_CHANGE],
  [PageType.IDENTITY]: [RedirectTypes.STAY],
  [PageType.PROFILE]: [
    RedirectTypes.CHAIN_PREFIX_CHANGE,
    RedirectTypes.WALLET_ADDRESS_CHANGE,
  ],
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
  [PageType.BLOG]: () => true,
  [PageType.BLOG_SLUG]: () => true,
  [PageType.PREFIX_TRANSFER]: (chain: Prefix) => transferVisible(chain),
  [PageType.IDENTITY]: (chain: Prefix) => identityVisible(chain),
  [PageType.PROFILE]: (chain: Prefix) => profileVisible(chain),
}

const generateRouteRegexPattern = (pattern: string): string => {
  const patternWithPlaceholderReplaced = pattern.replace(
    /\{[^}]{1,30}\}/g,
    '[^/]+'
  )
  const patternWithSlashesEscaped = patternWithPlaceholderReplaced.replace(
    /\//g,
    '\\/'
  )
  return `^${patternWithSlashesEscaped}$`
}

const getPageType = (routeName: string): PageType => {
  const matchingKey = Object.keys(PageType).find((key) => {
    const pagePattern = PageType[key]
    const regexPattern = generateRouteRegexPattern(pagePattern)
    return new RegExp(regexPattern).test(routeName)
  })

  return matchingKey as PageType
}

function updateUrlWithPattern(
  targetUrl: string,
  pattern: string,
  replacements: { [key: string]: string }
): string {
  // Replaces each placeholder in the pattern with a regex group
  const regexPattern = new RegExp(
    pattern.replace(/\{([a-zA-Z0-9_]+)\}/g, '(?<$1>.+?)'),
    'g'
  )

  return targetUrl.replace(regexPattern, (_, ...args) => {
    const groups = args.pop()

    let newUrl = pattern
    for (const [placeholder, replacement] of Object.entries(replacements)) {
      newUrl = newUrl.replace(
        `{${placeholder}}`,
        replacement || groups[placeholder]
      )
    }

    return newUrl
  })
}

export default function (allowRedirectIfCheckNotPresent = false) {
  const route = useRoute()
  const { accountId } = useAuth()

  const getChangedChainPrefixFromPath = (
    initialPath: RedirectPath,
    chain: Prefix,
    pageType: PageType
  ): RedirectPath => {
    return {
      path: updateUrlWithPattern(initialPath.path, pageType, {
        [PREFIX_PLACEHOLDER_NAME]: chain,
      }),
      query: initialPath.query,
    }
  }

  const updatePathWithCurrentWallet = (
    initialPath: RedirectPath,
    currentAccountId: string,
    pageType: PageType
  ): RedirectPath => {
    const { path, query } = initialPath

    return {
      path: updateUrlWithPattern(path, pageType, {
        [WALLET_PLACEHOLDER_NAME]: currentAccountId,
      }),
      query,
    }
  }

  const RedirectTypesActions: {
    [key in RedirectTypes]?: (
      chain: Prefix,
      initialPath: RedirectPath,
      pageType: PageType
    ) => RedirectPath
  } = {
    [RedirectTypes.CHAIN_PREFIX_CHANGE]: (
      chain: Prefix,
      initialPath: RedirectPath,
      pageType: PageType
    ) => getChangedChainPrefixFromPath(initialPath, chain, pageType),
    [RedirectTypes.WALLET_ADDRESS_CHANGE]: (
      chain: Prefix,
      initialPath: RedirectPath,
      pageType: PageType
    ) => updatePathWithCurrentWallet(initialPath, accountId.value, pageType),
  }

  const checkIfPageHasSpecialRedirect = (pageType: PageType): boolean => {
    return SpecialRedirectPageTypes.includes(pageType as PageType)
  }

  const getRedirect = ({
    chain,
    pageType,
  }: {
    chain: Prefix
    pageType: PageType
  }): RedirectPath => {
    const pageRedirectTypes = PageRedirectType[PageType[pageType]]

    return pageRedirectTypes.reduce(
      (reducer: RedirectPath, pageRedirectType: RedirectTypes) => {
        const redirectAction = RedirectTypesActions[pageRedirectType]

        if (!redirectAction) {
          return reducer
        }

        return redirectAction(chain, reducer, PageType[pageType])
      },
      {
        path: route.path,
        query: {},
      } as RedirectPath
    )
  }

  const getPageRedirectPath = (
    chain: Prefix,
    defaultRedirectPath: string
  ): RedirectPath | null => {
    const routePath = route.path || ''

    const defaultRedirect: RedirectPath = {
      path: defaultRedirectPath,
    }

    const pageType = getPageType(routePath)

    const hasSpecialRedirect = checkIfPageHasSpecialRedirect(pageType)

    if (!hasSpecialRedirect) {
      return defaultRedirect
    }

    const pageTypeValue = PageType[pageType]
    const pageRedirectTypes: RedirectTypes[] = PageRedirectType[pageTypeValue]
    const isStayRedirect = pageRedirectTypes.includes(RedirectTypes.STAY)

    let isPageAvailableForChain = allowRedirectIfCheckNotPresent
    const pageAvailabilityCheck = pageAvailabilityPerChain[pageTypeValue]

    if (pageAvailabilityCheck) {
      isPageAvailableForChain = pageAvailabilityCheck(chain)
    }

    if (isStayRedirect) {
      if (isPageAvailableForChain) {
        return null
      } else {
        return defaultRedirect
      }
    }

    if (isPageAvailableForChain) {
      return getRedirect({ chain: chain, pageType })
    }

    return defaultRedirect
  }

  const redirectAfterChainChange = (
    chain: Prefix,
    defaultRedirect = `/${chain}`
  ) => {
    const redirectPath = getPageRedirectPath(chain, defaultRedirect)

    if (!redirectPath) {
      return
    }

    navigateTo(redirectPath)
  }

  return {
    redirectAfterChainChange,
  }
}
