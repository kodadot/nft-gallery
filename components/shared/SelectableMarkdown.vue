<template>
  <VueMarkdown :source="description" class="is-selectable" />
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'
import VueMarkdown from 'vue-markdown-render'

@Component({
  components: {
    VueMarkdown
  }
})

export default class SelectableMarkdown extends Vue {
  @Prop() public description!: string
}
</script>

<style lang="scss" scoped>
.is-selectable {
    -webkit-user-select: text;
    -moz-user-select: text;
    -ms-user-select: text;
    user-select: text;
}
</style>
