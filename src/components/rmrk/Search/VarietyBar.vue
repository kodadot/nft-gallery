<template>
  <div class="card mb-4 p-2">
    <b-button
      v-for="(variety, key) in varities"
      v-bind:key="key"
      @click="selectVariety(variety)"
      :type="selectedVariety == variety ? 'is-link' : 'is-primary'"
      class="mr-2 my-2"
    >
      {{ variety }}
    </b-button>
  </div>
</template>

<script lang="ts">
import { Component, Emit, Vue } from "vue-property-decorator";
import { Varities } from "./helper";

@Component({})
export default class VarietyBar extends Vue {
	private varities = Varities;
	private selectedVariety: string = "";

	@Emit("selectVariety")
	public selectVariety(variety: string) {
		this.selectedVariety = variety;
		return variety;
	}
}
</script>

<style lang="scss" scoped>
.card {
	box-shadow: 0px 0px 5px 0.5px #d32e79;
}
</style>