<template>
    <Gallery />
</template>

<script lang="ts" >
import { Component, Vue } from 'vue-property-decorator';
import Gallery from '@/components/rmrk/Gallery/Gallery.vue'

@Component({
    components: {
      Gallery
    }
})

export default class GalleryPage extends Vue {
}
</script>
