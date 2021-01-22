<template>
    <b-field class="file is-primary" :class="{'has-name': !!file}" >
        <b-upload v-model="file" class="file-label">
            <span class="file-cta">
                <b-icon class="file-icon" :icon="icon"></b-icon>
                <span class="file-label">{{ label }}</span>
            </span>
            <span class="file-name" v-if="file">
                {{ file.name }}
            </span>
        </b-upload>
    </b-field>
</template>

<script lang="ts" >
import { Component, Prop, Vue, Watch, Emit } from 'vue-property-decorator';

@Component({})
export default class  extends Vue {
  @Prop({default: 'Click to add media file' }) public label!: string;
  @Prop({default: 'file-image' }) public icon!: string;
  private file: Blob | null = null;


  @Watch('file')
  public createInput(file: Blob): void {
    const reader = new FileReader();
    reader.onload = () => {
      // this.handleSelection(reader.result)
      // console.log(reader.result);
      
      
    };
    this.$emit('input', file)
    reader.readAsText(file);
    
  }


  @Emit('change')
	public handleSelection(value: string | ArrayBuffer | null) {
		return value;
	}
}
</script>
