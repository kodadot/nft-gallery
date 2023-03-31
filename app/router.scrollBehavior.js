// https://nuxtjs.org/docs/configuration-glossary/configuration-router/#scrollbehavior
export default function (to) {
  const toPath = to.name
  const disableScrollToTop = [
    'prefix-collection-id',
    'prefix-collection-id-activity',
    'prefix-explore-items',
    'prefix-explore-collectibles',
  ]

  if (disableScrollToTop.includes(toPath)) {
    return
  }

  return { x: 0, y: 0 }
}
