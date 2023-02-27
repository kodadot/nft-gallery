type PriceRange = {
  price_gt: string
  price_gte: number
  price_lte?: number
}[]

// search items by keywords
function useSearchKeywords() {
  const route = useRoute()

  return {
    keywords: computed(() => {
      return route.query.search?.length
        ? [{ name_containsInsensitive: route.query.search }]
        : []
    }),
  }
}

// search items by price range
function useSearchPriceRange() {
  const route = useRoute()

  return {
    priceRange: computed(() => {
      const price: PriceRange = []
      const minPrice = route.query.min ?? 0

      if (route.query.max) {
        price.push({
          price_gt: '0',
          price_gte: Number(minPrice),
          price_lte: Number(route.query.max),
        })
      } else {
        price.push({
          price_gt: '0',
          price_gte: Number(minPrice),
        })
      }

      return price
    }),
  }
}

// search items by owner
function useSearchOwner() {
  const route = useRoute()
  const { accountId } = useAuth()

  return {
    owner: computed(() => {
      return route.query.owned && accountId.value
        ? [{ currentOwner_eq: accountId.value }]
        : []
    }),
  }
}

// search items by collection id
function useSearchByCollectionId() {
  const route = useRoute()

  return {
    collectionId: computed(() => {
      return route.name === 'prefix-collection-id'
        ? [{ collection: { id_eq: route.params.id } }]
        : []
    }),
  }
}

// search items by user id
function useSearchByUserId() {
  const route = useRoute()

  return {
    userId: computed(() => {
      return route.name === 'prefix-u-id'
        ? [{ issuer_eq: route.params.id }]
        : []
    }),
  }
}

export function useSearchParams() {
  const { keywords } = useSearchKeywords()
  const { priceRange } = useSearchPriceRange()
  const { owner } = useSearchOwner()
  const { collectionId } = useSearchByCollectionId()
  const { userId } = useSearchByUserId()

  const searchParams = computed(() => {
    return [
      ...keywords.value,
      ...priceRange.value,
      ...owner.value,
      ...collectionId.value,
      ...userId.value,
    ]
  })

  return {
    searchParams,
  }
}
