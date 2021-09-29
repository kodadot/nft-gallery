<template>
  <div class="arguments-wrapper raw-label">
    <b-field :label="`${argument.name}: ${argument.type}`" class="raw-field">
      <b-input v-model="arg" :disabled="disabled" />
    </b-field>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

const DEFAULT = '0x'

@Component
export default class Raw extends Vue {
  @Prop() public argument!: any;
  @Prop({ default: false }) public readonly disabled!: boolean;
  @Prop({ default: null }) public readonly defaultValue!: any;

  set arg(value) {
  	console.log('ArgumentHandler', { [this.argument.name.toString()]: value })

  	this.$emit('selected', { [this.argument.name.toString()]: value })
  }

  get arg() {
  	return this.defaultValue ? this.defaultValue : DEFAULT
  }

}
</script>

<style scoped>
.arguments-wrapper {
  margin: 1em 0em 0em 1em;
}

.field.raw-field.is-floating-in-label .label {
  display: inline-block !important;
  white-space: nowrap !important;
  overflow: hidden !important;
  text-overflow: ellipsis !important;
  width: 95% !important;
}

 @media only screen and (max-width: 425px) {
  .arguments-wrapper {
    margin: 0.5em 0 0 0;
  }
}
</style>
