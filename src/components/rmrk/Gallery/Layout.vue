<template>
  <div class="content is-hidden-mobile">
    <b-field position="is-right">
      <b-tooltip label="Large display">
        <b-radio-button
          type="is-primary"
          v-model="layout"
          native-value="is-half-desktop is-half-tablet"
          @input="onInputChange"
        >
          <span>
            <b-icon icon="th-large"></b-icon>
          </span>
        </b-radio-button>
      </b-tooltip>
      <b-tooltip label="Small display">
        <b-radio-button
          type="is-primary"
          v-model="layout"
          native-value="is-one-quarter-desktop is-one-third-tablet"
          @input="onInputChange"
        >
          <span>
            <b-icon icon="th"></b-icon>
          </span>
        </b-radio-button>
      </b-tooltip>
    </b-field>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { RmrkType } from '@/components/rmrk/service/scheme'

@Component({ })
export default class Layout extends Vue {
  @Prop({ default: 'nftDetail' }) public type!: string;
  @Prop({ default: 'rmrk/detail' }) public link!: string;
  @Prop() public items!: RmrkType[];
  public layout = 'is-half-desktop is-half-tablet'

  public onInputChange (data :string) {
    this.$store.dispatch('setLayoutClass', data)
  }
}
</script>
<style>
.b-radio.radio.button.is-selected {
  background-color: #db2980;
}
</style>
