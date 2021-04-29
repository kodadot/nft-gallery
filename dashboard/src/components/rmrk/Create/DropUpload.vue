<template>
  <b-field class="file is-primary">
    <b-upload v-model="file" class="file-label" drag-drop :expanded="expanded">
      <section class="section">
        <div class="content has-text-centered">
          <p>
            <b-icon :icon="icon" size="is-large"> </b-icon>
          </p>

          <p v-if="!file">{{ label }}</p>
          <p v-else>Awesome your file is <b>{{ file.name }}</b>. Click or drop to change</p>
        </div>
      </section>
    </b-upload>
    <Tooltip iconsize="is-medium" label="Upload your image of the NFT" />
  </b-field>
</template>

<script lang="ts" >
import { Component, Prop, Vue, Watch, Emit } from 'vue-property-decorator';
import Tooltip from '@/components/shared/Tooltip.vue';

@Component({
  components: {
    Tooltip
  }
})
export default class extends Vue {
  @Prop({ default: 'Drop your NFT here or click to upload' }) public label!: string;
  @Prop({ default: 'upload' }) public icon!: string;
  @Prop(Boolean) public expanded!: boolean;
  private file: Blob | null = null;

  @Watch('file')
  public createInput(file: Blob): void {
    const reader = new FileReader();
    reader.onload = () => {
      // this.handleSelection(reader.result)
      // console.log(reader.si);
    };
    this.$emit('input', file);
    console.log(file.size);
    reader.readAsText(file);
  }

  @Emit('change')
  public handleSelection(value: string | ArrayBuffer | null) {
    return value;
  }
}
</script>
