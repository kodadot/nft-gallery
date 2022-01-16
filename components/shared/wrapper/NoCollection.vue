<template>
  <div>
    <span>{{ $t(label) }}.</span>
    <nuxt-link to="/rmrk/create">
      <div>{{ $t('helper.clickToCreate') }}</div>
    </nuxt-link>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator';
@Component({})
export default class NoCollection extends Vue {
  @Prop({ type: String, default: 'helper.noCollections' })
  public label!: string;
}
</script>
