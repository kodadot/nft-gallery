<template>
  <div>
    <TitleLabel value="price" />
    <div>
      <div>
        <Money :value="nft.price" inline />
      </div>
      <slot />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'

const components = {
  TitleLabel: () => import('@/components/shared/gallery/Label.vue'),
}

@Component({ components })
export default class Price extends Vue {
  @Prop(String) public value!: string
}
</script>
