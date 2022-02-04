<template>
  <component
    :is="resolveComponent"
    v-if="src"
    :src="src"
    :poster="poster"
    :description="description"
    :preview="preview"
    :availableAnimations="availableAnimations" />
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'
import { resolveMedia } from '../utils'

const VideoMedia = () => import('./VideoMedia.vue')
const ImageMedia = () => import('./ImageMedia.vue')
const AudioMedia = () => import('./AudioMedia.vue')
const JsonMedia = () => import('./JsonMedia.vue')
const ModelMedia = () => import('./ModelMedia.vue')
const IFrameMedia = () => import('./IFrameMedia.vue')
const ObjectMedia = () => import('./ObjectMedia.vue')
const Media = () => import('./Unknown.vue')
const SUFFIX = 'Media'
@Component({
  components: {
    VideoMedia,
    ImageMedia,
    AudioMedia,
    JsonMedia,
    ModelMedia,
    IFrameMedia,
    ObjectMedia,
    Media,
  },
})
export default class MediaResolver extends Vue {
  @Prop(String) public src!: string
  @Prop(String) public mimeType!: string
  @Prop(String) public poster?: string
  @Prop(String) public description?: string
  @Prop(Array) public availableAnimations?: string[]
  @Prop(Boolean) public preview!: boolean

  get resolveComponent() {
    return resolveMedia(this.mimeType) + SUFFIX
  }
}
</script>
