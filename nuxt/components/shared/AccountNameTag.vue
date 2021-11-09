<template>
  <div>
    <b-tag
      type="is-dark"
      size="is-medium"
    >
      🧢{{ metaName }}
    </b-tag>
  </div>
</template>
<script lang="ts" >
import { Component, Prop, Vue } from 'nuxt-property-decorator'

@Component({})
export default class AccountNameTag extends Vue {
  @Prop() public metaName!: string;
}
</script>
