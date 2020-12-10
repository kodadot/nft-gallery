<template>
    <b-field class="file is-primary" :class="{'has-name': !!file}"  accept="application/json, text/plain">
        <b-upload v-model="file" class="file-label">
            <span class="file-cta">
                <b-icon class="file-icon" icon="upload"></b-icon>
                <span class="file-label">Click to add metadata json</span>
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

  private file: Blob | null = null;


  @Watch('file')
  public createInput(file: any): void {
    const reader = new FileReader();
    reader.onload = () => {
      this.handleSelection(reader.result)
      console.log(reader.result);
      
    };
    reader.readAsText(file);
  }


  @Emit('change')
	public handleSelection(value: string | ArrayBuffer | null) {
		return value;
	}
}
</script>
