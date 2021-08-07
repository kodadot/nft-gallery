<template>
  <h2 class="has-text-weight-bold is-size-4">
    {{ isCategory ? category : $t('rmrk.searchCategory') }}    🔍
  </h2>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";

@Component({})
export default class ResultBar extends Vue {
	@Prop() public category!: string;

	get isCategory(): boolean {
		if (!this.category || this.category == "") {
			return false;
		}
		return true;
	}
}
</script>