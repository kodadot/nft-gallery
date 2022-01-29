<template>
  <Base :id="$route.params.id" />
</template>

<script lang="ts" >
import { Component, Vue } from 'nuxt-property-decorator'
import Base from '@/components/metaverse/Base.vue'

@Component({
  components: {
    Base
  }
})

export default class CollectionMeta extends Vue {
}
</script>
