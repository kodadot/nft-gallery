<template>
  <MediaResolver
    :src="properSrc"
    :mimeType="properType"
    poster="/placeholder.webp"
    preview />
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'
import { get, update } from 'idb-keyval'
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
    this.fetchMimeType()
  }

  get properType() {
    return this.mimeType || this.type || 'image/webp'
  }

  get properSrc() {
    return this.src || '/placeholder.webp'
  }

  protected async fetchMimeType() {
    if (this.mimeType) {
      return
    }

    const m = await get<NFTMetadata>(this.metadata)
    this.type = m?.type || ''
    if (!this.type) {
      const { headers } = await axios.head(this.src)
      this.type = headers['content-type']
      update(this.metadata, (cached) => ({
        ...(cached || {}),
        type: this.type,
      }))
    }
  }
}
</script>
