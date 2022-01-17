<template>
  <CollectionItem />
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import CollectionItem from '@/components/unique/Collection/Item/CollectionItem.vue'

@Component({
  components: {
    CollectionItem,
  },
})
export default class CollectionItemPage extends Vue {}
</script>
