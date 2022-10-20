<template>
  <div class="block">
    <Label value="legend" />
    <DescriptionWrapper :text="text" />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'

const components = {
  DescriptionWrapper: () =>
    import('@/components/shared/collapse/DescriptionWrapper.vue'),
  Label: () => import('@/components/shared/gallery/Label.vue'),
}

@Component({ components })
export default class Description extends Vue {
  @Prop(String) public value!: string

  get text() {
    return this.value.replaceAll('\n', '  \n')
  }
}
</script>
