<template>
  <div class="container">
		<Loader :value="isLoading" />
		<SearchBar
			@selectSearch="selectSearch"
			@selectMedium="selectMedium"
			@selectFilter="selectFilter"
		/>
    <ConditionBar @selectCondition="selectCondition" />
    <VarietyBar @selectVariety="selectVariety" />
		<ResultBar />
		{{ search }} | {{ medium }} | {{ filter }} | {{ condition }} | {{ variety }}

  </div>
</template>

<script lang="ts">
import { Component, Vue, Emit } from "vue-property-decorator";
import { Debounce } from "vue-debounce-decorator";

const components = {
	SearchBar: () => import("@/components/rmrk/Search/SearchBar.vue"),
	ConditionBar: () => import("@/components/rmrk/Search/ConditionBar.vue"),
	VarietyBar: () => import("@/components/rmrk/Search/VarietyBar.vue"),
	ResultBar: () => import("@/components/rmrk/Search/ResultBar.vue"),
	Loader: () => import("@/components/shared/Loader.vue"),
};

@Component({ components })
export default class Search extends Vue {
	private search: string = "";
	private medium: string = "";
	private filter: string = "";
	private condition: string = "";
	private variety: string = "";

	get isLoading() {
		return false;
	}

	get results() {
		return [];
	}

	@Emit("selectSearch")
	@Debounce(400)
	private selectSearch(search: string) {
		this.search = search;
	}

	@Emit("selectMedium")
	@Debounce(400)
	private selectMedium(medium: string) {
		this.medium = medium;
	}

	@Emit("selectFilter")
	@Debounce(400)
	private selectFilter(filter: string) {
		this.filter = filter;
	}

	@Emit("selectCondition")
	@Debounce(100)
	private selectCondition(condition: string) {
		console.log("select rmrk condition", condition);
		this.condition = condition;
	}

	@Emit("selectVariety")
	@Debounce(100)
	private selectVariety(variety: string) {
		console.log("select rmrk variety", variety);
		this.variety = variety;
	}
}
</script>