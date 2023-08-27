export default function ({ redirect, route }): void {
  const { urlPrefix } = usePrefix()

  let redirectValue

  console.log(route.path)

  const paths = [
    {
      cond: (val) => val === '/drops',
      replaceValue: () => '/ahk/drops',
    },
    {
      replaceValue: () => `/${urlPrefix.value}/explore/collectibles`,
      cond: (val) =>
        new RegExp(`^\\/${urlPrefix.value}\\/.*\\/collections$`).test(val),
    },
    {
      cond: (val) =>
        new RegExp(`^\\/${urlPrefix.value}\\/.*\\/gallery$`).test(val),
      replaceValue: () => `/${urlPrefix.value}/explore/items`,
    },
    {
      cond: (val) => val.includes('/stmn/'),
      replaceValue: () => window.location.href.replace('/stmn/', '/ahk/'),
    },
    {
      cond: (val) => val.includes('/rmrk2/'),
      replaceValue: () => window.location.href.replace('/rmrk2/', '/ksm/'),
    },
    {
      cond: (val) => val.includes('/transfer'),
      replaceValue: () =>
        window.location.href.replace('/transfer/', '/ksm/transfer'),
    },
  ]

  for (const path of paths) {
    if (path.cond(route.path)) {
      redirectValue = path.replaceValue()
      console.log(route.path, redirectValue)
      break
    }
  }

  if (redirect) {
    return redirect(redirectValue)
  }
}
