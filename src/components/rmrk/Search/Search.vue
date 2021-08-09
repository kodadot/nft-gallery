<template>
  <div class="container">
		<Loader :value="isLoading" />
		<SearchBar />
    <ConditionBar @selectCondition="selectCondition" />
    <VarietyBar @selectVariety="selectVariety" />
		<Gallery />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Emit } from "vue-property-decorator";
import { Debounce } from "vue-debounce-decorator";

const components = {
	SearchBar: () => import("@/components/rmrk/Search/SearchBar.vue"),
	ConditionBar: () => import("@/components/rmrk/Search/ConditionBar.vue"),
	VarietyBar: () => import("@/components/rmrk/Search/VarietyBar.vue"),
	Gallery: () => import("@/components/rmrk/Search/Gallery.vue"),
	Loader: () => import("@/components/shared/Loader.vue"),
};

@Component({ components })
export default class Search extends Vue {
	private condition: string = "";
	private variety: string = "";

	get isLoading() {
		return false;
	}

	get results() {
		return [];
	}

	@Emit("selectCondition")
	private selectCondition(condition: string) {
		console.log("select rmrk condition", condition);
		this.condition = condition;
	}

	@Emit("selectVariety")
	private selectVariety(variety: string) {
		console.log("select rmrk variety", variety);
		this.variety = variety;
	}
}
</script>