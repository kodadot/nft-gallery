<template>
  <div class="card mb-4 p-2">
    <b-button
      v-for="(condition, key) in conditions"
      v-bind:key="key"
      @click="selectCondition(condition)"
      :type="selectedCondition == condition ? 'is-link' : 'is-primary'"
      class="mr-2 my-2"
    >
      {{ condition }}
    </b-button>
  </div>
</template>

<script lang="ts">
import { Component, Emit, Vue } from "vue-property-decorator";
import { Conditions } from "./helper";

@Component({})
export default class ConditionBar extends Vue {
	private conditions = Conditions;
	private selectedCondition: string = "";

	@Emit("selectCondition")
	public selectCondition(condition: string) {
		this.selectedCondition = condition;
		return condition;
	}
}
</script>

<style lang="scss" scoped>
.card {
	box-shadow: 0px 0px 5px 0.5px #d32e79;
}
</style>