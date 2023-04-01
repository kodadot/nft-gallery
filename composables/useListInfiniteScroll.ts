import {
  useDebounceFn,
  useInfiniteScroll,
  useResizeObserver,
  useScroll,
} from '@vueuse/core'

export const INFINITE_SCROLL_CONTAINER_ID = 'infinite-scroll-container'
export const INFINITE_SCROLL_ITEM_CLASS_NAME = 'infinite-scroll-item'

type LoadDirection = 'up' | 'down'

export default function ({
  defaultFirst,
  defaultScrollContainerId,
  defaultScrollItemClassName,
  gotoPage,
  fetchPageData,
}: {
  defaultFirst?: number
  defaultScrollContainerId?: string
  defaultScrollItemClassName?: string
  gotoPage: (page: number) => void
  fetchPageData: (
    page: number,
    loadDirection?: LoadDirection
  ) => Promise<boolean>
}) {
  const route = useRoute()
  const router = useRouter()
  const { $consola } = useNuxtApp()
  const currentPage = ref(parseInt(route.query.page as string) || 1)
  const startPage = ref(currentPage.value)
  const endPage = ref(startPage.value)
  const scrollItemHeight = ref(300)
  const itemsPerRow = ref(4)
  const scrollItemSizeInit = ref(false)
  const first = ref(defaultFirst || 40)
  const total = ref(0)
  const isFetchingData = ref(false)

  const containerRef = ref<Window>(window)

  useInfiniteScroll(
    containerRef,
    () => {
      if (canLoadNextPage.value) {
        reachBottomHandler()
      }
    },
    { distance: 0 }
  )

  const scrollContainerId = ref(
    defaultScrollContainerId ?? INFINITE_SCROLL_CONTAINER_ID
  )
  const scrollItemClassName = ref(
    defaultScrollItemClassName ?? INFINITE_SCROLL_ITEM_CLASS_NAME
  )

  const canLoadNextPage = computed(
    () =>
      endPage.value < Math.ceil(total.value / first.value) && total.value > 0
  )

  const pageHeight = computed(
    (): number => scrollItemHeight.value * (first.value / itemsPerRow.value)
  )

  const updateCurrentPage = () => {
    const page =
      Math.floor(document.documentElement.scrollTop / pageHeight.value) +
      startPage.value
    if (page) {
      replaceUrlPage(String(page))
      currentPage.value = page
    }
  }

  const onResize = useDebounceFn(() => {
    try {
      const container = document.getElementById(scrollContainerId.value)
      const scrollItem = document.body.querySelector(
        `.${scrollItemClassName.value}`
      )
      if (scrollItem && container) {
        scrollItemHeight.value = scrollItem.clientHeight
        itemsPerRow.value = Math.max(
          Math.floor(container.clientWidth / scrollItem.clientWidth),
          1
        )
        scrollItemSizeInit.value = true
      }
    } catch (err) {
      $consola.warn('resize scroll item', err)
    }
  }, 1000)

  useScroll(window, { onScroll: updateCurrentPage, throttle: 1000 })
  useResizeObserver(document.body, onResize)

  const replaceUrlPage = (page: string) => {
    if (page === route.query.page) {
      return
    }
    router
      .replace({
        path: String(route.path),
        query: { ...route.query, page },
      })
      .catch($consola.warn)
  }

  const reachTopHandler = useDebounceFn(() => {
    fetchPreviousPage()
  }, 1000)

  const fetchDataCallback = async (
    page: number,
    direction: LoadDirection,
    successCb: () => void
  ) => {
    return await fetchPageData(page, direction).then((isSuccess) => {
      if (isSuccess) {
        successCb()
      }
      return isSuccess
    })
  }

  const fetchPreviousPage = async () => {
    if (startPage.value <= 1) {
      return
    }
    const nextPage = startPage.value - 1
    await fetchDataCallback(startPage.value - 1, 'up', () => {
      startPage.value = nextPage
      checkAfterFetchDataSuccess()
    })
  }

  const reachBottomHandler = useDebounceFn(() => {
    fetchNextPage()
  }, 1000)

  const fetchNextPage = async () => {
    if (!canLoadNextPage.value) {
      return
    }
    const nextPage = endPage.value + 1
    await fetchDataCallback(nextPage, 'down', () => {
      endPage.value = nextPage
      checkAfterFetchDataSuccess()
      prefetchNextPage()
    })
  }

  const prefetchNextPage = async () => {
    updateCurrentPage()
    if (endPage.value - currentPage.value <= 3 && canLoadNextPage.value) {
      await fetchNextPage()
    }
  }

  const checkAfterFetchDataSuccess = () => {
    checkCurrentPageIsValid()
    checkScrollItemSize()
  }

  const checkCurrentPageIsValid = () => {
    const maxPage = Math.ceil(total.value / first.value)
    if (maxPage > 0 && currentPage.value > maxPage) {
      gotoPage(maxPage)
    }
  }

  const checkScrollItemSize = () => {
    if (scrollItemSizeInit.value) {
      return
    }
    onResize()
  }

  return {
    isFetchingData,
    fetchPreviousPage,
    reachTopHandler,
    prefetchNextPage,
    first,
    total,
    startPage,
    currentPage,
    endPage,
    scrollItemClassName,
    scrollContainerId,
  }
}
