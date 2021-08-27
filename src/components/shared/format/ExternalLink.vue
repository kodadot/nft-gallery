<template>
  <a :href="id ? url+id : url" target="_blank" rel="noopener noreferrer">
     <slot></slot>
  </a>
</template>

<script lang="ts" >
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component({})
export default class ExternalLink extends Vue {
  @Prop() public url!: string;
  @Prop() public id!: string;

}
</script>
