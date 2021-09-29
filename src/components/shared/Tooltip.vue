<template>
    <p class="control">
      <b-tooltip type="is-white"
        size="is-small" position="is-left"
        :label="label" multilined square>
        <b-button type="is-dark">
          <b-icon :size="iconsize" icon="info"></b-icon>
        </b-button>
      </b-tooltip>
    </p>
</template>

<script lang="ts" >
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'

@Component({})
export default class Tooltip extends Vue {
  @Prop() public label!: string;
  @Prop({ default: 'is-medium' }) public iconsize!: string;
}
</script>
