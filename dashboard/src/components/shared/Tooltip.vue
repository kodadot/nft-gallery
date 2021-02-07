<template>
    <p class="control">
      <b-tooltip type="is-primary is-light" 
        size="is-small" position="is-left"
        :label="label" multilined square>   
        <b-icon :size="iconsize" icon="info"></b-icon>
      </b-tooltip>
    </p>
</template>

<script lang="ts" >
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';

@Component({})
export default class Tooltip extends Vue {
  @Prop() public label!: string;
  @Prop({ default: 'is-large' }) public iconsize!: string;
}
</script>
