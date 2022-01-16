const withPrefix = /-/

export default function ({ store, route }) {
  const prefix = store.getters.currentUrlPrefix
  if (withPrefix.test(route.name)) {
    if (
      !RegExp(prefix).test(route.name) &&
      !RegExp(route.name).test(route.path)
    ) {
      console.log('[PREFIX] from', prefix, 'to', route.name)
      store.dispatch('setUrlPrefix', route.name.split(withPrefix)[0])
    }
  }
}
