<template>
  <div class="container">
		<Loader :value="isLoading" />
    <FilterBar @selectCategory="selectCategory" />
    <ResultBar :category="category" />
    <QueryBar @selectQuery="selectQuery" />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch, Emit } from "vue-property-decorator";
import { Debounce } from "vue-debounce-decorator";

const components = {
	FilterBar: () => import("@/components/rmrk/Search/FilterBar.vue"),
	ResultBar: () => import("@/components/rmrk/Search/ResultBar.vue"),
	QueryBar: () => import("@/components/rmrk/Search/QueryBar.vue"),
	Loader: () => import("@/components/shared/Loader.vue"),
};

@Component({ components })
export default class Search extends Vue {
	private category: string = "";
	private query: string = "";

	get isLoading() {
		return false;
	}

	get results() {
		return [];
	}

	@Emit("selectCategory")
	private selectCategory(category: string) {
		console.log("select rmrk category", category);
		this.category = category;
	}

	@Emit("selectQuery")
	private selectQuery(query: string) {
		console.log("select rmrk query", query);
		this.query = query;
	}
}
</script>