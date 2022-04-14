import { Component, Vue } from 'nuxt-property-decorator'
import { Debounce } from 'vue-debounce-decorator'

@Component
export default class InfiniteScrollMixin extends Vue {
  protected currentPage = parseInt(this.$route.query.page as string) || 1
  protected startPage = this.currentPage
  protected endPage = this.startPage
  protected scrollItemHeight = 300
  protected itemsPerRow = 3
  protected mobileScreenWidth = 768
  protected first = 12
  protected total = 0
  protected isFetchingData = false

  protected mounted() {
    window.addEventListener('resize', this.onResize)
    window.addEventListener('scroll', this.onScroll)
    this.onResize()
  }

  protected beforeDestroy() {
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

  @Debounce(1000)
  protected onScroll(): void {
    const currentPage =
      Math.floor(document.documentElement.scrollTop / this.pageHeight) +
      this.startPage
    this.replaceUrlPage(String(currentPage))
    this.currentPage = currentPage
  }

  protected replaceUrlPage(page: string): void {
    if (page === this.$route.query.page) return
    this.$router
      .replace({
        path: String(this.$route.path),
        query: { ...this.$route.query, page },
      })
      .catch(this.$consola.warn /*Navigation Duplicate err fix later */)
  }

  protected onResize(): void {
    try {
      this.itemsPerRow =
        document.body.clientWidth > this.mobileScreenWidth ? 3 : 1
      const scrollItem = document.body.querySelector('.scroll-item')
      if (scrollItem) {
        this.scrollItemHeight = scrollItem.clientHeight
      }
    } catch (err) {
      this.$consola.warn('resize scroll item', err)
    }
  }

  @Debounce(1000)
  protected reachTopHandler($state): void {
    if (this.startPage < 1) return
    const nextPage = this.startPage - 1
    this.fetchPageData(this.startPage - 1, 'up', () => {
      this.startPage = nextPage
      $state.loaded()
    })
  }

  @Debounce(1000)
  protected reachBottomHandler($state): void {
    if (!this.canLoadNextPage) {
      return
    }
    const nextPage = this.endPage + 1
    this.fetchPageData(nextPage, 'down', () => {
      this.endPage = nextPage
      $state.loaded()
    })
  }

  protected fetchPageData(page, loadDirection, cb): void {
    this.$consola.warn(
      'fetchPageData need to be extended',
      page,
      loadDirection,
      cb
    )
  }
}
