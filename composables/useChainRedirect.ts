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
 * The patterns within the enum can be matched against URLs to identify specific routes.
 * Certain patterns within the enum include placeholders encapsulated within curly braces {} for dynamic parts of the URL.
 *
 * Examples:
 * - '/{prefix}/explore/items' contains a '{prefix}' placeholder. For a URL like '/rmrk/explore/items', the value for '{prefix}' would be 'rmrk'.
 * - '/{prefix}/u/{wallet}' has placeholders '{prefix}' and '{wallet}'. If the URL is '/rmrk/u/abc123', the values would be 'rmrk' for '{prefix}' and 'abc123' for '{wallet}'.
 */
enum RoutePattern {
  PREFIX_EXPLORE_ITEMS = '/{prefix}/explore/items',
  PREFIX_EXPLORE_COLLECTIBLES = '/{prefix}/explore/collectibles',
  SALES = '/sales',
  HOT = '/hot',
  SERIES_INSIGHT = '/series-insight',
  BLOG = '/blog',
  BLOG_SLUG = '/blog/{slug}',
  PREFIX_MASSMINT = '/{prefix}/massmint',
  PREFIX_MASSMINT_ONBOARDING = '/{prefix}/massmint/onboarding',
  PREFIX_CLASSIC_CREATE = '/{prefix}/create',
  PREFIX_TRANSFER = '/{prefix}/transfer',
  IDENTITY = '/identity',
  PROFILE = '/{prefix}/u/{wallet}',
}

type RedirectPath = {
  path: string
  query?: {
    [key: string]: any
  }
}

const RouteRedirectTypes: { [key in RoutePattern]?: RedirectTypes[] } = {
  [RoutePattern.PREFIX_EXPLORE_ITEMS]: [RedirectTypes.CHAIN_PREFIX_CHANGE],
  [RoutePattern.PREFIX_EXPLORE_COLLECTIBLES]: [
    RedirectTypes.CHAIN_PREFIX_CHANGE,
  ],
  [RoutePattern.SALES]: [RedirectTypes.STAY],
  [RoutePattern.HOT]: [RedirectTypes.STAY],
  [RoutePattern.SERIES_INSIGHT]: [RedirectTypes.STAY],
  [RoutePattern.BLOG]: [RedirectTypes.STAY],
  [RoutePattern.BLOG_SLUG]: [RedirectTypes.STAY],
  [RoutePattern.PREFIX_MASSMINT]: [RedirectTypes.CHAIN_PREFIX_CHANGE],
  [RoutePattern.PREFIX_MASSMINT_ONBOARDING]: [
    RedirectTypes.CHAIN_PREFIX_CHANGE,
  ],
  [RoutePattern.PREFIX_CLASSIC_CREATE]: [RedirectTypes.CHAIN_PREFIX_CHANGE],
  [RoutePattern.PREFIX_TRANSFER]: [RedirectTypes.CHAIN_PREFIX_CHANGE],
  [RoutePattern.IDENTITY]: [RedirectTypes.STAY],
  [RoutePattern.PROFILE]: [
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

const SpecialRedirectroutePatterns: RoutePattern[] = Object.keys(
  RouteRedirectTypes
)
  .map<RoutePattern>(
    (value) => getEnumKeyByValue(RoutePattern, value) as RoutePattern
  )
  .filter(Boolean) as RoutePattern[]

const pageAvailabilityPerChain = {
  [RoutePattern.PREFIX_EXPLORE_ITEMS]: (chain: Prefix): boolean =>
    explorerVisible(chain),
  [RoutePattern.PREFIX_EXPLORE_COLLECTIBLES]: (chain: Prefix): boolean =>
    explorerVisible(chain),
  [RoutePattern.SERIES_INSIGHT]: (chain: Prefix) => seriesInsightVisible(chain),
  [RoutePattern.PREFIX_CLASSIC_CREATE]: (chain: Prefix) => createVisible(chain),
  [RoutePattern.PREFIX_MASSMINT]: (chain: Prefix) =>
    massmintCreateVisible(chain),
  [RoutePattern.PREFIX_MASSMINT_ONBOARDING]: (chain: Prefix) =>
    massmintCreateVisible(chain),
  [RoutePattern.SALES]: (chain: Prefix) => salesVisible(chain),
  [RoutePattern.HOT]: (chain: Prefix) => hotVisible(chain),
  [RoutePattern.BLOG]: () => true,
  [RoutePattern.BLOG_SLUG]: () => true,
  [RoutePattern.PREFIX_TRANSFER]: (chain: Prefix) => transferVisible(chain),
  [RoutePattern.IDENTITY]: (chain: Prefix) => identityVisible(chain),
  [RoutePattern.PROFILE]: (chain: Prefix) => profileVisible(chain),
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

const getMatchingRoutePattern = (routeName: string): RoutePattern => {
  const matchingKey = Object.keys(RoutePattern).find((key) => {
    const pagePattern = RoutePattern[key]
    const regexPattern = generateRouteRegexPattern(pagePattern)
    return new RegExp(regexPattern).test(routeName)
  })

  return matchingKey as RoutePattern
}

function updateUrlWithPattern(
  targetUrl: string,
  pattern: string,
  replacements: { [key: string]: string }
): string {
  const regexPattern = new RegExp(pattern.replace(/\{(\w+)\}/g, '(?<$1>[^/]+)'))

  const match = targetUrl.match(regexPattern)

  if (!match?.groups) {
    return targetUrl
  }

  const { groups } = match

  let newUrl = targetUrl
  for (const [placeholderName, replacement] of Object.entries(replacements)) {
    if (groups[placeholderName] && (replacement || replacement === '')) {
      newUrl = newUrl.replace(groups[placeholderName], replacement)
    }
  }

  return newUrl
}

export default function (allowRedirectIfCheckNotPresent = false) {
  const route = useRoute()
  const { accountId } = useAuth()

  const getChangedChainPrefixFromPath = (
    chain: Prefix,
    routePattern: RoutePattern,
    initialPath: RedirectPath
  ): RedirectPath => ({
    path: updateUrlWithPattern(initialPath.path, routePattern, {
      [PREFIX_PLACEHOLDER_NAME]: chain,
    }),
    query: initialPath.query,
  })

  const updatePathWithCurrentWallet = (
    currentAccountId: string,
    routePattern: RoutePattern,
    initialPath: RedirectPath
  ): RedirectPath => ({
    path: updateUrlWithPattern(initialPath.path, routePattern, {
      [WALLET_PLACEHOLDER_NAME]: currentAccountId,
    }),
    query: initialPath.query,
  })

  const RouteRedirectActions: {
    [key in RedirectTypes]?: (
      chain: Prefix,
      routePattern: RoutePattern,
      initialPath: RedirectPath
    ) => RedirectPath
  } = {
    [RedirectTypes.CHAIN_PREFIX_CHANGE]: (
      chain: Prefix,
      routePattern: RoutePattern,
      initialPath: RedirectPath
    ) => getChangedChainPrefixFromPath(chain, routePattern, initialPath),
    [RedirectTypes.WALLET_ADDRESS_CHANGE]: (
      chain: Prefix,
      routePattern: RoutePattern,
      initialPath: RedirectPath
    ) =>
      updatePathWithCurrentWallet(accountId.value, routePattern, initialPath),
  }

  const checkIfRouteHasSpecialRedirect = (
    routePattern: RoutePattern
  ): boolean => {
    return SpecialRedirectroutePatterns.includes(routePattern as RoutePattern)
  }

  const getRedirect = ({
    chain,
    routePattern,
  }: {
    chain: Prefix
    routePattern: RoutePattern
  }): RedirectPath => {
    const routeRedirectTypes = RouteRedirectTypes[RoutePattern[routePattern]]

    return routeRedirectTypes.reduce(
      (redirectPath: RedirectPath, pageRedirectType: RedirectTypes) => {
        const redirectAction = RouteRedirectActions[pageRedirectType]

        if (!redirectAction) {
          return redirectPath
        }

        return redirectAction(chain, RoutePattern[routePattern], redirectPath)
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

    const routePattern = getMatchingRoutePattern(routePath)

    const hasSpecialRedirect = checkIfRouteHasSpecialRedirect(routePattern)

    if (!hasSpecialRedirect) {
      return defaultRedirect
    }

    const routePatternValue = RoutePattern[routePattern]
    const routeRedirectTypes: RedirectTypes[] =
      RouteRedirectTypes[routePatternValue]
    const isStayRedirect = routeRedirectTypes.includes(RedirectTypes.STAY)

    let isPageAvailableForChain = allowRedirectIfCheckNotPresent
    const pageAvailabilityCheck = pageAvailabilityPerChain[routePatternValue]

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
      return getRedirect({ chain, routePattern: routePattern })
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
