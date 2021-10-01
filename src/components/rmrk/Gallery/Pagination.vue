<template>
  <b-pagination
    :total="total"
    :current.sync="current"
    :range-before="3"
    :range-after="3"
    :simple="simple"
    :per-page="perPage"
    order=""
    tag="a"
    aria-next-label="Next page"
    aria-previous-label="Previous page"
    aria-page-label="Page"
    aria-current-label="Current page"
    @change="onPageChange"
  >
  </b-pagination>
</template>

<script lang="ts" >
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import { exist } from './Search/exist'
import { Debounce } from 'vue-debounce-decorator'

@Component({})
export default class Pagination extends Vue {
  @Prop() value!: number
  @Prop() public total!: number
  @Prop(Boolean) simple!: boolean
  @Prop({ default: 20 }) public perPage!: number
  @Prop(Boolean) replace!: boolean

  public mounted() {
    exist(this.$route.query.page, (val) => {
      this.current = Number(val)
    })
    // console.log('query', this.$route.query)
    // if (
    //   this.$route.query.search &&
    //   typeof this.$route.query.search === 'string'
    // ) {
    //   this.updateSearch(this.$route.query.search);
    // }
  }

  public onPageChange() {
    this.scrollTop()
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
        name: String(this.$route.name),
        query: { ...this.$route.query, [key]: value },
      })
      .catch(console.warn /*Navigation Duplicate err fix later */)
  }
}
</script>
