<template>
  <MediaResolver
    :src="properSrc"
    :mimeType="properType"
    poster="/placeholder.webp"
    preview />
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'
import { get } from 'idb-keyval'
import { NFTMetadata } from '../service/scheme'
import axios from 'axios'

const MediaResolver = () => import('./MediaResolver.vue')

@Component({
  components: {
    MediaResolver,
  },
})
export default class PreviewMediaResolver extends Vue {
  @Prop(String) public src!: string
  @Prop(String) public metadata!: string
  @Prop(String) public mimeType!: string
  protected type = ''

  created() {
    this.devsDoSomething()
  }

  // get visible() {
  //   return this.src && this.mimeType
  // }

  // mounted() {
  //   this.fetchContentType(this.src)
  // }

  get properType() {
    return this.mimeType || this.type || 'image/webp'
  }

  get properSrc() {
    return this.src || '/placeholder.webp'
  }

  protected async devsDoSomething() {
    console.log('devsDoSomething')
    if (this.mimeType) {
      console.log('boys we have types', this.mimeType)
      return
    }
    // First try if you have metadata :)
    // if yes then get type of it
    // otherwise fetch yolo
    const m = await get<NFTMetadata>(this.metadata)
    this.type = m?.type || ''
    if (!this.type) {
      const { headers } = await axios.head(this.src)
      console.log('headers', headers)
      this.type = headers['content-type']
    }

    // todo now update meta
  }

  // async fetchContentType(val: string) {
  //   try {
  //     const { headers } = await api.get(val);
  //     this.resolveComponent =
  // //   } catch (e) {
  //     console.warn(`[MEDIA RESOLVER] Unable to get content type of ${val}`)
  //   }

  // }
}
</script>
