<template>
  <PackItem />
</template>

<script lang="ts" >
import { Component, Vue } from 'nuxt-property-decorator'
import PackItem from '@/components/rmrk/Pack/PackItem.vue'

@Component({
  components: {
    PackItem
  }
})

export default class PackItemPage extends Vue {
}
</script>
