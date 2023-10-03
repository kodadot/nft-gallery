export const displayOnPages = [
  'prefix-u-id', //profile page
  'prefix-explore-items', //explore items page
  'prefix-collection-id', //collection page
]

export default function () {
  const route = useRoute()

  return {
    listingCartEnabled: computed(() =>
      displayOnPages.includes(route.name ?? '')
    ),
  }
}
