import type { RouterConfig } from '@nuxt/schema'

const findEl = async (hash, x = 0) => {
  return (
    document.querySelector(hash)
    || new Promise((resolve) => {
      if (x > 50) {
        return resolve(document.querySelector('#app'))
      }
      setTimeout(() => {
        resolve(findEl(hash, ++x || 1))
      }, 100)
    })
  )
}

const defaultScrollBehavior = async (to): Promise<false | any | { left: number, top: number }> => {
  const toPath = to.name
  const disableScrollToTop = [
    'prefix-collection-id',
    'prefix-collection-id-activity',
    'prefix-collection-id-offers',
    'prefix-collection-id-swaps',
    'prefix-explore-items',
    'prefix-explore-collectibles',
    'prefix-u-id',
    'prefix-transfer',
  ]

  if (disableScrollToTop.includes(toPath)) {
    return
  }

  if (to.hash) {
    const el = await findEl(to.hash)
    if (el) {
      const top = el.offsetTop
      // Perform scroll as a side effect
      if ('scrollBehavior' in document.documentElement.style) {
        window.scrollTo({ top, behavior: 'smooth' })
      }
      else {
        window.scrollTo(0, top)
      }
      // Always return the correct type, not the result of window.scrollTo
      return false
    }
  }

  return { left: 0, top: 0 }
}

export default {
  scrollBehavior: defaultScrollBehavior,
  scrollBehaviorType: 'smooth',
} satisfies RouterConfig
