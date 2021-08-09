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
  </div>
</template>

<script lang="ts">
import { Component, Vue, Emit } from "vue-property-decorator";
import { Debounce } from "vue-debounce-decorator";
import nftListWithSearch from "@/queries/nftListWithSearch.graphql";

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
	private searchResult = [];

	get isLoading() {
		return false;
	}

	@Emit("selectSearch")
	@Debounce(400)
	private async selectSearch(search: string) {
		this.search = search;
		await this.fetchSearchItems();
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
		this.condition = condition;
	}

	@Emit("selectVariety")
	@Debounce(100)
	private selectVariety(variety: string) {
		this.variety = variety;
	}

	@Debounce(100)
	protected async fetchSearchItems() {
		this.$apollo.addSmartQuery("nfts", {
			query: nftListWithSearch,
			manual: true,
			loadingKey: "isLoading",
			result: this.handleResult,
			variables: () => {
				return {
					search: this.search
						? [
								{
									name: { likeInsensitive: `%${this.search}%` },
								},
						  ]
						: [],
				};
			},
		});
	}

	protected async handleResult({ data }: any) {
		console.log("search result", data);
	}
}
</script>