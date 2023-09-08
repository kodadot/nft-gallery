const findEl = async (hash, x = 0) => {
  return (
    document.querySelector(hash) ||
    new Promise((resolve) => {
      if (x > 50) {
        return resolve(document.querySelector('#app'))
      }
      setTimeout(() => {
        resolve(findEl(hash, ++x || 1))
      }, 100)
    })
  )
}

// https://nuxtjs.org/docs/configuration-glossary/configuration-router/#scrollbehavior
export default async function (to) {
  const toPath = to.name
  const disableScrollToTop = [
    'prefix-collection-id',
    'prefix-collection-id-activity',
    'prefix-explore-items',
    'prefix-explore-collectibles',
    'prefix-u-id',
    'prefix-transfer',
  ]

  if (disableScrollToTop.includes(toPath)) {
    return
  }

  // https://github.com/nuxt/nuxt/issues/5359
  if (to.hash) {
    let el = await findEl(to.hash)
    if ('scrollBehavior' in document.documentElement.style) {
      return window.scrollTo({ top: el.offsetTop, behavior: 'smooth' })
    } else {
      return window.scrollTo(0, el.offsetTop)
    }
  }

  return { x: 0, y: 0 }
}
