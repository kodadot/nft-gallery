
<template>
  <component :is="resolveComponent" :src="src" />
</template>

<script lang="ts" >
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import shouldUpdate from '@/utils/shouldUpdate';
import { resolveMedia } from '../utils'
import api from '@/fetch';


const VideoMedia = () => import('./VideoMedia.vue')
const ImageMedia = () => import('./ImageMedia.vue')
const AudioMedia = () => import('./AudioMedia.vue')
const Media = () => import('./Unknown.vue')
const SUFFIX = 'Media'
@Component({
  components: {
    VideoMedia,
    ImageMedia,
    AudioMedia,
    Media
  }
})
export default class MediaResolver extends Vue {
  @Prop() public src!: string;
  @Prop() public mimeType!: string;
  
  get resolveComponent() {
    return resolveMedia(this.mimeType) + SUFFIX
  }

  // get visible() {
  //   return this.src && this.mimeType
  // }

  // mounted() {
  //   this.fetchContentType(this.src)
  // }

  // @Watch('src')
  // private async watchSrc(val: string, oldVal: string) {
  //   if (shouldUpdate(val, oldVal)) {
  //     await this.fetchContentType(val)
  //   }
  // }

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
