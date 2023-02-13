import { Component, Vue } from 'nuxt-property-decorator'
import { Debounce } from 'vue-debounce-decorator'

export const INFINITE_SCROLL_CONTAINER_ID = 'infinite-scroll-container'
export const INFINITE_SCROLL_ITEM_CLASS_NAME = 'infinite-scroll-item'

type LoadDirection = 'up' | 'down'
@Component
export default class InfiniteScrollMixin extends Vue {
  protected currentPage = parseInt(this.$route.query.page as string) || 1
  protected startPage = this.currentPage
  protected endPage = this.startPage
  protected scrollItemHeight = 300
  protected itemsPerRow = 4
  private scrollItemSizeInit = false
  protected mobileScreenWidth = 768
  protected first = 20
  protected total = 0
  protected prefetchDistance = 600
  protected isFetchingData = false
  protected scrollContainerId = INFINITE_SCROLL_CONTAINER_ID
  protected scrollItemClassName = INFINITE_SCROLL_ITEM_CLASS_NAME

  protected mounted(): void {
    window.addEventListener('resize', this.onResize)
    window.addEventListener('scroll', this.onScroll)
  }

  protected beforeDestroy(): void {
    window.removeEventListener('resize', this.onResize)
    window.removeEventListener('scroll', this.onScroll)
  }
  get offset(): number {
    return this.endPage * this.first - this.first
  }

  get canLoadNextPage() {
    return this.endPage < Math.ceil(this.total / this.first)
  }
  get pageHeight() {
    return this.scrollItemHeight * (this.first / this.itemsPerRow)
  }

  private updateCurrentPage() {
    const currentPage =
      Math.floor(document.documentElement.scrollTop / this.pageHeight) +
      this.startPage
    if (currentPage) {
      this.replaceUrlPage(String(currentPage))
      this.currentPage = currentPage
    }
  }

  @Debounce(1000)
  protected onScroll(): void {
    this.updateCurrentPage()
  }

  protected replaceUrlPage(page: string): void {
    if (page === this.$route.query.page) {
      return
    }
    this.$router
      .replace({
        path: String(this.$route.path),
        query: { ...this.$route.query, page },
      })
      .catch(this.$consola.warn /*Navigation Duplicate err fix later */)
  }

  @Debounce(1000)
  protected onResize(): void {
    try {
      const container = document.getElementById(this.scrollContainerId)
      const scrollItem = document.body.querySelector(
        `.${this.scrollItemClassName}`
      )
      if (scrollItem && container) {
        this.scrollItemHeight = scrollItem.clientHeight
        this.itemsPerRow = Math.max(
          Math.ceil(container.clientWidth / scrollItem.clientWidth),
          1
        )
        this.scrollItemSizeInit = true
      }
    } catch (err) {
      this.$consola.warn('resize scroll item', err)
    }
  }

  @Debounce(1000)
  protected async reachTopHandler($state): Promise<void> {
    await this.fetchPreviousPage()
    $state.loaded()
  }

  private async fetchDataCallback(
    page: number,
    direction: LoadDirection,
    successCb: () => void
  ) {
    return await this.fetchPageData(page, direction).then((isSuccess) => {
      if (isSuccess) {
        successCb()
      }
      return isSuccess
    })
  }

  protected async fetchPreviousPage() {
    if (this.startPage <= 1) {
      return
    }
    const nextPage = this.startPage - 1
    await this.fetchDataCallback(this.startPage - 1, 'up', () => {
      this.startPage = nextPage
      this.checkAfterFetchDataSuccess()
      this.prefetchPreviousPage()
    })
  }

  @Debounce(1000)
  protected async reachBottomHandler($state): Promise<void> {
    await this.fetchNextPage()
    $state?.loaded()
  }

  public async fetchNextPage() {
    if (!this.canLoadNextPage) {
      return
    }
    const nextPage = this.endPage + 1
    await this.fetchDataCallback(nextPage, 'down', () => {
      this.endPage = nextPage
      this.checkAfterFetchDataSuccess()
      this.prefetchNextPage()
    })
  }

  public async prefetchNextPage() {
    this.updateCurrentPage()
    if (this.endPage - this.currentPage <= 4 && this.canLoadNextPage) {
      await this.fetchNextPage()
    }
  }

  public async prefetchPreviousPage() {
    this.updateCurrentPage()
    if (this.currentPage - this.startPage <= 1 && this.startPage > 1) {
      await this.fetchPreviousPage()
    }
  }

  public async prefetchPage(prefetchCount = 3, fetchFn: () => void) {
    if (prefetchCount > 0) {
      await fetchFn()
      this.prefetchPage(prefetchCount - 1, fetchFn)
    }
  }

  private checkAfterFetchDataSuccess(): void {
    this.checkCurrentPageIsValid()
    this.checkScrollItemSize()
  }

  protected async fetchPageData(
    page,
    loadDirection
  ): Promise<boolean | undefined> {
    this.$consola.warn('fetchPageData need to be extended', page, loadDirection)
    return true
  }

  protected gotoPage(page: number): void {
    this.$consola.warn('gotoPage need to be extended', page)
  }

  private checkCurrentPageIsValid(): void {
    const maxPage = Math.ceil(this.total / this.first)
    if (maxPage > 0 && this.currentPage > maxPage) {
      this.gotoPage(maxPage)
    }
  }

  private checkScrollItemSize(): void {
    if (this.scrollItemSizeInit) {
      return
    }
    this.onResize()
  }
}
