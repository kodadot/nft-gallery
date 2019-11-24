<template>
  <div class="arguments-wrapper bytes">
    <b-field
      :label="`${argument.name}: ${argument.type}`"
      v-if="!uploadEnabled"
    >
      <b-input v-model="arg" />
      <p class="control">
        <b-button
          @click="enableUpload"
          class="button is-primary"
          icon-left="file"
        />
      </p>
    </b-field>
    <FileUpload v-else @uploaded="selected" />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit } from "vue-property-decorator";
import FileUpload from "./FileUpload.vue";

@Component({
  name: "Bytes",
  components: {
    FileUpload
  }
})
export default class Bytes extends Vue {
  @Prop() public argument!: any;
  private uploadEnabled: boolean = false;

  set arg(value) {
    console.log("ArgumentHandler", { [this.argument.name.toString()]: value });
    this.selected(value);
  }

  @Emit("selected")
  selected(value: any) {
    return { [this.argument.name.toString()]: value };
  }

  get arg() {
    return "0x";
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
</style>
