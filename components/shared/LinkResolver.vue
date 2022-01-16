<template>
  <component :is="is">
    <template v-if="profileMode">
      <slot name="extra" />
      <nuxt-link :to="`${route}/${param}`" :tag="tag">
        <slot />
      </nuxt-link>
    </template>
    <template v-else>
      <a :href="hrefLink" target="_blank" rel="noopener noreferrer">
        <slot />
      </a>
    </template>
  </component>
</template>

<script lang="ts">
import { Component, Prop, mixins } from 'nuxt-property-decorator';
import InlineMixin from '@/utils/mixins/inlineMixin';
import isShareMode from '@/utils/isShareMode';

@Component
export default class LinkResolver extends mixins(InlineMixin) {
  @Prop({ default: '/rmrk/gallery' }) public route!: string;
  @Prop({ default: 'rmrk/gallery' }) public link!: string;
  @Prop({ default: 'a' }) public tag!: string;
  @Prop({}) public param!: string;

  get profileMode() {
    return !isShareMode;
  }

  get hrefLink() {
    return `${window.location.origin}/${this.link}/${this.param}`;
  }
}
</script>
