export default function ({ store, redirect, route }): void {
  const prefix = store.getters.currentUrlPrefix

  if (route.path.startsWith(`/${prefix}`)) {
    if (route.path.endsWith('collections')) {
      return redirect(`/${prefix}/explore/collectibles`)
    }
    if (route.path.endsWith('gallery')) {
      return redirect(`/${prefix}/explore/items`)
    }
  }

  if (route.path.includes('/rmrk2/')) {
    return redirect(window.location.href.replace('/rmrk2/', '/ksm/'))
  }
}
