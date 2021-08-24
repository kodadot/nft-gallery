<template>
  <component :is="is">
    <template v-if="profileMode">
      <router-link :to="{ name: route, params: { id: param } }" :tag="tag">
        <slot />
      </router-link>
      <slot name="extra" />
    </template>
    <template v-else>
      <a :href="hrefLink" target="_blank" rel="noopener noreferrer">
        <slot />
      </a>
    </template>
  </component>
</template>

<script lang="ts" >
import { Component, Prop, Vue, Watch, Mixins } from 'vue-property-decorator';
import InlineMixin from '@/utils/mixins/inlineMixin';
import isShareMode from '@/utils/isShareMode';

@Component
export default class LinkResolver extends Mixins(InlineMixin) {
  @Prop({ default: 'nftDetail' }) public route!: string;
  @Prop({ default: 'rmrk/detail' }) public link!: string;
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
