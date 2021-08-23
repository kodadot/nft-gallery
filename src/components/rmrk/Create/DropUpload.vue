<template>
  <b-field class="file is-primary">
    <b-upload v-model="file" class="file-label" drag-drop :expanded="expanded" :accept="accept" :multiple="multiple">
      <section class="section">
        <div class="content has-text-centered">
          <p>
            <b-icon v-if="!file && !url" :icon="icon" size="is-large" />
            <b-icon v-else-if="Array.isArray(file)" icon="plus" size="is-large" />
            <img v-if="url && !hasError" :src="url" @error="hasError = true" />
            <b-icon v-if="hasError" icon="eye-slash" size="is-large" />
          </p>
          <p v-if="!file">{{ label }}</p>
          <p v-else-if="Array.isArray(file)">Nice you added <b>{{ file.length }}</b> NFTs. Click or drop to add more!</p>
          <p v-else>Awesome your file is <b>{{ file.name }}</b>. Click or drop to change</p>
        </div>
      </section>
    </b-upload>
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
  @Prop(Boolean) public preview!: boolean;
  @Prop(Boolean) public multiple!: boolean;
  @Prop(String) public accept!: string;
  protected file: File[] | File | null = null;
  protected url: string = '';
  protected hasError: boolean = false;

  @Watch('file')
  public createInput(file: Blob | Blob[]): void {
    this.$emit('input', file);
    if (this.preview && !this.multiple) {
      this.url = URL.createObjectURL(file);
      this.hasError = false;
    }
  }

  @Emit('change')
  public handleSelection(value: string | ArrayBuffer | null) {
    return value;
  }
}
</script>
