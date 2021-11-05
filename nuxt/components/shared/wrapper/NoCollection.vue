<template>
  <div>
    <span>{{ $t(label) }}.</span>
    <router-link to="/rmrk/create">
      <div>{{ $t('helper.clickToCreate') }}</div>
    </router-link>
  </div>
</template>

<script lang="ts" >
import { Component, Prop, Vue, Watch } from 'nuxt-property-decorator'
@Component({})
export default class NoCollection extends Vue {
  @Prop({ type: String, default: 'helper.noCollections' }) public label!: string;
}
</script>
