export default function ({ redirect, route }): void {
  const { urlPrefix } = usePrefix()

  if (route.path === '/drops') {
    return redirect('/ahk/drops')
  }

  if (route.path.startsWith(`/${urlPrefix.value}`)) {
    if (route.path.endsWith('collections')) {
      return redirect(`/${urlPrefix.value}/explore/collectibles`)
    }
    if (route.path.endsWith('gallery')) {
      return redirect(`/${urlPrefix.value}/explore/items`)
    }
  }

  if (route.path.includes('/stmn/')) {
    return redirect(window.location.href.replace('/stmn/', '/ahk/'))
  }

  if (route.path.includes('/rmrk2/')) {
    return redirect(window.location.href.replace('/rmrk2/', '/ksm/'))
  }
  if (route.path.startsWith('/transfer')) {
    return redirect(window.location.href.replace('/transfer', '/ksm/transfer'))
  }
}
