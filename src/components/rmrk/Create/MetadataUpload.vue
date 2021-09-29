<template>
  <b-field class="file is-primary" :class="{'has-name': !!file}" >
    <b-upload v-model="file" class="file-label" expanded>
      <span class="file-cta">
        <b-icon class="file-icon" :icon="icon"></b-icon>
        <span class="file-label">{{ label }}</span>
      </span>
      <span class="file-name" v-if="file">
        {{ file.name }}
      </span>
    </b-upload>
    <Tooltip iconsize="is-medium" label="Upload your image of the NFT" />
  </b-field>
</template>

<script lang="ts" >
import { Component, Prop, Vue, Watch, Emit } from 'vue-property-decorator'
import Tooltip from '@/components/shared/Tooltip.vue'

@Component({ components: {
	Tooltip
} })
export default class  extends Vue {
  @Prop({default: 'Add Multimedia' }) public label!: string;
  @Prop({default: 'file-image' }) public icon!: string;
  private file: Blob | null = null;

  @Watch('file')
  public createInput(file: Blob): void {
  	const reader = new FileReader()
  	reader.onload = () => {
  		// this.handleSelection(reader.result)
  		// console.log(reader.si);


  	}
  	this.$emit('input', file)
  	console.log(file.size)
  	reader.readAsText(file)

  }

  @Emit('change')
  public handleSelection(value: string | ArrayBuffer | null) {
  	return value
  }
}
</script>
