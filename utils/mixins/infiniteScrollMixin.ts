import { Component, Vue } from 'nuxt-property-decorator'
import { Debounce } from 'vue-debounce-decorator'

@Component
export default class InfiniteScrollMixin extends Vue {
  protected startPage = parseInt(this.$route.query.page as string) || 1
  protected endPage = this.startPage
  protected scrollItemHeight = 300
  protected itemsPerRow = 3
  protected first = 12
  protected total = 0
  protected isFetchingData = false

  protected mounted() {
    window.addEventListener('resize', this.onResize)
    window.addEventListener('scroll', this.onScroll)
    this.onResize()
  }

  protected beforeDestroy() {
    window.addEventListener('resize', this.onResize)
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
  protected onScroll() {
    const currentPage =
      Math.floor(document.documentElement.scrollTop / this.pageHeight) +
      this.startPage
    this.replaceUrlPage(String(currentPage))
  }

  protected replaceUrlPage(page: string) {
    if (page === this.$route.query.page) return
    this.$router
      .replace({
        path: String(this.$route.path),
        query: { ...this.$route.query, page },
      })
      .catch(console.warn /*Navigation Duplicate err fix later */)
  }

  protected onResize() {
    try {
      const scrollItem = document.body.querySelector('.scroll-item')
      if (scrollItem) {
        this.scrollItemHeight = scrollItem.clientHeight
      }
    } catch (err) {
      console.warn('resize scroll item', err)
    }
  }

  @Debounce(1000)
  protected async reachTopHandler($state) {
    if (this.startPage < 1) return
    const nextPage = this.startPage - 1
    await this.fetchPageData(this.startPage - 1, 'up', () => {
      this.startPage = nextPage
      $state.loaded()
    })
  }

  @Debounce(1000)
  protected async reachBottomHandler($state) {
    if (!this.canLoadNextPage) {
      return
    }
    const nextPage = this.endPage + 1
    await this.fetchPageData(nextPage, 'down', () => {
      this.endPage = nextPage
      $state.loaded()
    })
  }

  protected fetchPageData(page, loadDirection = 'down', cb): void {
    console.warn('fetchPageData need to be extended', page, loadDirection, cb)
  }
}
