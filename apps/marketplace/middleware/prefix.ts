import { URL_PREFIXES } from '@kodadot1/vuex-options'
const withPrefix = /-/
const prefixes = URL_PREFIXES.map((option) => option.value as string).map(
  // skipcq allowRegExp
  (value) => RegExp(`^${value}`)
)

export default function ({ store, route }): void {
  const prefix = store.getters.currentUrlPrefix
  const routeName = route.name

  if (
    // skipcq allowRegExp
    !RegExp(`^${prefix}`).test(routeName) &&
    prefixes.some((x) => x.test(routeName))
  ) {
    const newPrefix = routeName.split(withPrefix)[0]
    console.log('[PREFIX] from', prefix, 'to', newPrefix)
    store.dispatch('setUrlPrefix', newPrefix)
    return routeName.split(withPrefix)[0]
  }
}
