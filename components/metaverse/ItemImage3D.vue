<template>
<!-- v-if="!loading" -->
  <a-image

    color="white"
    :src="item.image"
    width="0.36"
    height="0.36"
    position="0 0 0.026"
    name="nft-img"
  ></a-image>
</template>

<script>
import Axios from 'axios'
export default {
  props: {
    item: Object,
  },
  data() {
    return {
      imageResponse: null,
      loading: true,
      errored: false,
    }
  },
  methods: {
    async loadImage() {
      console.log(this.item.image)
      return await Axios
        .get(
          this.item.image
        )
        .then((response) => (this.imageResponse = response))

        .catch((error) => {
          console.log(error)
          this.errored = true
        })
        .finally(() => (this.loading = false))
    },
  },
  computed: {
    // imagePath() {
    //   if (this.loading) {
    //     return "";
    //   }
    //   console.log("🚀 ~ file: ItemImage3D.vue ~ line 48 ~ imagePath ~ this.imageResponse", this.imageResponse)

    //   return this.imageResponse.data.media_details.sizes.full.source_url;
    // },
  },

  mounted() {
    //this.loadImage();
  },
}
</script>

