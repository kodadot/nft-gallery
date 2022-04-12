export default function ({ store, redirect, route }): void {
  const prefix = store.getters.currentUrlPrefix
  if (route.path.startsWith(`/${prefix}`)) {
    if (route.path.endsWith('collections')) {
      return redirect(`/${prefix}/explore?tab=COLLECTION`)
    }
    if (route.path.endsWith('gallery')) {
      return redirect(`/${prefix}/explore`)
    }
  }
}
