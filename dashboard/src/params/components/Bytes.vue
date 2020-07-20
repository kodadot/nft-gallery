<template>
  <div class="arguments-wrapper bytes">
    <b-field
      :label="`${argument.name}: ${argument.type}`"
      v-if="!uploadEnabled"
    >
      <b-input v-model="arg" :disabled="disabled" />
      <p class="control">
        <b-button
          @click="enableUpload"
          class="button is-primary"
          icon-left="file"
          :disabled="disabled" 
        />
      </p>
    </b-field>
    <FileUpload v-if="uploadEnabled" @uploaded="selected" />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit } from 'vue-property-decorator';
import FileUpload from './FileUpload.vue';

@Component({
  name: 'Bytes',
  components: {
    FileUpload,
  },
})
export default class Bytes extends Vue {
  @Prop() public argument!: any;
  @Prop({ default: false }) public readonly disabled!: boolean;
  @Prop({ default: null }) public readonly defaultValue!: any;

  private uploadEnabled: boolean = false;


  get arg() {
    return this.defaultValue ? this.defaultValue : '0x';
  }

  set arg(value) {
    console.log('ArgumentHandler', { [this.argument.name.toString()]: value });
    this.selected(value);
  }

  @Emit('selected')
  public selected(value: any) {
    return { [this.argument.name.toString()]: value };
  }

  private enableUpload() {
    this.uploadEnabled = true;
  }
}
</script>

<style scoped>
.arguments-wrapper {
  margin: 1em 0em 0em 1em;
}

.arguments-wrapper.bytes .control.is-clearfix {
  flex: 1;
}

@media only screen and (max-width: 425px) {
  .arguments-wrapper {
    margin: 0.5em 0 0 0;
  }
}
</style>
