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
import { NFTWithMeta, NFT, Metadata } from "../service/scheme";
import { Debounce } from "vue-debounce-decorator";
import { denyList } from "@/constants";
import nftListWithSearch from "@/queries/nftListWithSearch.graphql";
import { getMany, update } from "idb-keyval";
import { fetchNFTMetadata, sanitizeIpfsUrl } from "../utils";
import { basicAggQuery } from "../Gallery/Search/query";

interface Image extends HTMLImageElement {
	ffInitialized: boolean;
}

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
	private nfts: NFT[] = [];
	private first = 12;
	private currentValue = 1;
	private total = 0;
	private placeholder = require("@/assets/koda300x300.svg");

	get isLoading() {
		return false;
	}

	get offset() {
		return this.currentValue * this.first - this.first;
	}

	get results() {
		return basicAggQuery(this.nfts as NFTWithMeta[]);
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
			result: this.handleResult,
			variables: () => {
				return {
					first: this.first,
					offset: this.offset,
					denyList,
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
		this.total = data.nFTEntities.totalCount;
		this.nfts = data.nFTEntities.nodes.map((e: any) => ({
			...e,
			emoteCount: e.emotes?.totalCount,
		}));

		const storedMetadata = await getMany(
			this.nfts.map(({ metadata }: any) => metadata)
		);

		storedMetadata.forEach(async (m, i) => {
			if (!m) {
				try {
					const meta = await fetchNFTMetadata(this.nfts[i]);
					Vue.set(this.nfts, i, {
						...this.nfts[i],
						...meta,
						image: sanitizeIpfsUrl(meta.image || ""),
					});
				} catch (e) {
					console.warn("[ERR] unable to get metadata");
				}
			} else {
				Vue.set(this.nfts, i, {
					...this.nfts[i],
					...m,
					image: sanitizeIpfsUrl(m.image || ""),
				});
			}
		});

		console.log("handle result nfts", this.nfts);
	}

	onError(e: Event) {
		const target = e.target as Image;
		target.src = this.placeholder;
	}
}
</script>