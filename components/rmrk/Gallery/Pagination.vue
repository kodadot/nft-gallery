<template>
  <div
    class="is-align-self-flex-end is-flex is-justify-content-flex-end"
    v-if="total > perPage">
    <b-pagination
      :total="total"
      :current.sync="current"
      :range-before="3"
      :range-after="3"
      :simple="simple"
      :per-page="perPage"
      tag="a"
      aria-next-label="Next page"
      aria-previous-label="Previous page"
      aria-page-label="Page"
      aria-current-label="Current page"
      @change="onPageChange">
    </b-pagination>
    <b-tooltip :label="$i18n.t('tooltip.random') + ' (g+r)'">
      <b-button
        class="ml-2 magicBtn"
        title="Go to random page"
        v-if="hasMagicBtn"
        type="is-primary"
        icon-left="dice"
        @click="goToRandomPage">
      </b-button>
    </b-tooltip>
  </div>
</template>

<script lang="ts">
import { Component, Prop, mixins } from 'nuxt-property-decorator'
import { exist } from './Search/exist'
import { Debounce } from 'vue-debounce-decorator'
import { getRandomIntInRange } from '../utils'
import KeyboardEventsMixin from '~/utils/mixins/keyboardEventsMixin'

@Component({})
export default class Pagination extends mixins(KeyboardEventsMixin) {
  @Prop() value!: number
  @Prop() public total!: number
  @Prop(Boolean) simple!: boolean
  @Prop({ type: Number, default: 20 }) public perPage!: number
  @Prop(Boolean) replace!: boolean
  @Prop(Boolean) preserveScroll!: boolean
  @Prop(Boolean) hasMagicBtn!: boolean

  public mounted() {
    exist(this.$route.query.page, (val) => {
      // when component is mounted, if there is search query present always start from first page
      this.current = this.$route.query.search ? 1 : Number(val)
    })
    // console.log('query', this.$route.query)
    // if (
    //   this.$route.query.search &&
    //   typeof this.$route.query.search === 'string'
    // ) {
    //   this.updateSearch(this.$route.query.search);
    // }
  }

  public created() {
    if (this.hasMagicBtn) {
      this.initKeyboardEventHandler({
        g: this.bindPaginationEvents,
      })
    }
  }

  private bindPaginationEvents(event) {
    switch (event.key) {
      case 'n':
        if (this.current < Math.ceil(this.total / this.perPage))
          this.current = this.current + 1
        break
      case 'p':
        if (this.current > 1) {
          this.current = this.current - 1
        }
        break
      case 'r':
        this.goToRandomPage()
        break
    }
  }

  public onPageChange() {
    if (!this.preserveScroll) {
      this.scrollTop()
    }
  }

  public goToRandomPage() {
    this.onPageChange()
    const pageSize = Math.ceil(this.total / this.perPage)
    let randomNumber = getRandomIntInRange(1, pageSize)
    this.current = randomNumber
  }

  public scrollTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  get current() {
    return this.value
  }

  set current(value: number) {
    this.$emit('input', value)
    this.replace && this.replaceUrl(String(value))
  }

  @Debounce(100)
  replaceUrl(value: string, key = 'page') {
    this.$router
      .replace({
        path: String(this.$route.path),
        query: { ...this.$route.query, [key]: value },
      })
      .catch(console.warn /*Navigation Duplicate err fix later */)
  }
}
</script>
<style lang="scss">
.magicBtn {
  border-width: 1px;
}

.info {
  font-size: 12px;
  margin: 0 0.25rem;
  height: 40px;
  width: 86px;
  display: flex;
  align-items: center;
}
</style>
