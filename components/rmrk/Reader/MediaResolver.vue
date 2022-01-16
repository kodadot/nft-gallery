<template>
  <component
    :is="resolveComponent"
    v-if="visible"
    :src="src"
    :mime-type="mimeType"
  />
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'nuxt-property-decorator';
import { resolveMedia } from '../utils';

const VideoMedia = () => import('./Media/VideoMedia.vue');
const ImageMedia = () => import('./Media/ImageMedia.vue');
const AudioMedia = () => import('./Media/AudioMedia.vue');
const Media = () => import('./Media/Unknown.vue');

const SUFFIX = 'Media';

@Component({
  components: {
    VideoMedia,
    ImageMedia,
    AudioMedia,
    Media,
  },
})
export default class MediaResolver extends Vue {
  @Prop() public src!: string;
  @Prop() public mimeType!: string;

  get resolveComponent() {
    return resolveMedia(this.mimeType) + SUFFIX;
  }

  get visible() {
    return this.src && this.mimeType;
  }
}
</script>
