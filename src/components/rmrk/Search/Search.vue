<template>
  <div class="gallery container">
		<Loader :value="isLoading" />
		<SearchBar
			@selectSearch="selectSearch"
			@selectMedium="selectMedium"
			@selectFilter="selectFilter"
		/>
    <ConditionBar @selectCondition="selectCondition" />
    <VarietyBar @selectVariety="selectVariety" />
		<div>
			<div class="columns is-multiline">
				<div class="column is-4" v-for="nft in results" :key="nft.id">
					<div class="card nft-card">
						<router-link
							:to="{ name: 'nftDetail', params: { id: nft.id } }"
							tag="div"
							class="nft-card__skeleton"
						>
							<div class="card-image">
								<span v-if="nft.emoteCount" class="card-image__emotes">
									<b-icon icon="heart" />
									<span class="card-image__emotes__count">{{
										nft.emoteCount
									}}</span>
								</span>
								<figure class="gallery__image-wrapper">
									<img
										:src="placeholder"
										:data-src="nft.image"
										:data-type="nft.type"
										:alt="nft.name"
										class="lazyload gallery__image"
										:class="{ 'card-image__burned': nft.burned }"
										@error="onError"
									/>
								</figure>
								<span v-if="nft.price > 0" class="card-image__price">
									<Money :value="nft.price" inline />
								</span>
							</div>

							<div class="card-content">
								<span
									v-if="!isLoading"
									class="title mb-0 is-4 has-text-centered"
									id="hover-title"
									:title="nft.name"
								>
									<router-link
										v-if="nft.count < 2"
										:to="{ name: 'nftDetail', params: { id: nft.id } }"
									>
										<div>
											<div class="has-text-overflow-ellipsis middle">
												{{ nft.name }}
											</div>
										</div>
									</router-link>
									<router-link
										v-else
										:to="{
											name: 'collectionDetail',
											params: { id: nft.collectionId }
										}"
									>
										<div class="has-text-overflow-ellipsis">
											{{ nft.name }}
										</div>
									</router-link>

									<p
										v-if="nft.count > 2"
										:title="`${nft.count} items available in collection`"
										class="is-absolute nft-collection-counter title is-6"
									>
										「{{ nft.count }}」
									</p>
								</span>
								<b-skeleton :active="isLoading"> </b-skeleton>
							</div>
						</router-link>
					</div>
				</div>
			</div>
		</div>
		<Pagination
			class="pt-5 pb-5"
      :total="total"
      v-model="currentValue"
      replace
		/>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Emit } from "vue-property-decorator";
import { NFTWithMeta, NFT, Metadata } from "../service/scheme";
import { Debounce } from "vue-debounce-decorator";
import { denyList } from "@/constants";
import nftListWithSearch from "@/queries/nftListWithSearch.graphql";
import { getMany, update } from "idb-keyval";
import Freezeframe from "freezeframe";
import { fetchNFTMetadata, sanitizeIpfsUrl } from "../utils";
import { basicAggQuery } from "../Gallery/Search/query";

interface Image extends HTMLImageElement {
	ffInitialized: boolean;
}

const components = {
	SearchBar: () => import("@/components/rmrk/Search/SearchBar.vue"),
	ConditionBar: () => import("@/components/rmrk/Search/ConditionBar.vue"),
	VarietyBar: () => import("@/components/rmrk/Search/VarietyBar.vue"),
	Pagination: () => import("@/components/rmrk/Search/Pagination.vue"),
	Money: () => import("@/components/shared/format/Money.vue"),
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

	setFreezeframe() {
		document.addEventListener("lazybeforeunveil", async (e) => {
			const target = e.target as Image;
			const type = target.dataset.type as string;
			const isGif = type === "image/gif";

			if (isGif && !target.ffInitialized) {
				const ff = new Freezeframe(target, {
					trigger: false,
					overlay: true,
					warnings: false,
				});

				target.ffInitialized = true;
			}
		});
	}

	onError(e: Event) {
		const target = e.target as Image;
		target.src = this.placeholder;
	}
}
</script>

<style lang="scss" scoped>
.card-image__burned {
	filter: blur(7px);
}

.gallery {
	@media screen and (max-width: 1023px) {
		padding: 0 15px;
	}

	&__image-wrapper {
		position: relative;
		margin: auto;
		padding-top: 100%;
		overflow: hidden;
		cursor: pointer;
	}

	&__image {
		bottom: 0;
		left: 0;
		position: absolute;
		right: 0;
		border-radius: 8px;
		top: 50%;
		transition: all 0.3s;
		display: block;
		width: 100%;
		height: auto;
		transform: scale(1) translateY(-50%);
	}

	.ff-container {
		position: absolute;
		top: 0;
		height: 100%;
		overflow: hidden;

		.ff-overlay {
			z-index: 2;
		}

		.ff-image,
		.ff-canvas {
			top: 50%;
			height: auto;
			transform: translateY(-50%);
			transition: all 0.3s !important;
		}
	}

	.has-text-overflow-ellipsis {
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
		color: #fff;
	}

	.card-image__emotes__count {
		vertical-align: text-bottom;
	}

	.is-float-right {
		float: right;
	}

	.is-color-pink {
		color: #d32e79;
	}

	.is-absolute {
		position: absolute;
	}

	.nft-collection-counter {
		top: 5px;
		right: -5px;
	}

	.columns {
		padding-top: 10px;

		.card {
			border-radius: 8px;
			position: relative;
			overflow: hidden;
			box-shadow: 0px 0px 10px 0.5px #d32e79;

			&-image {
				.ff-canvas {
					border-radius: 8px;
				}

				&__emotes {
					position: absolute;
					background-color: #d32e79;
					border-radius: 4px;
					padding: 3px 8px;
					color: #fff;
					top: 10px;
					right: 10px;
					font-size: 14px;
					z-index: 3;
					transition: all 0.3s;
				}

				&__price {
					position: absolute;
					background-color: #363636;
					border-radius: 4px;
					padding: 3px 8px;
					color: #fff;
					bottom: 10px;
					left: 10px;
					font-size: 14px;
					z-index: 3;
					transition: all 0.3s;
				}
			}

			@media screen and (min-width: 1024px) {
				&-content {
					position: absolute;
					bottom: -45px;
					left: 0;
					width: 100%;
					transition: all 0.3s;
					background: #fff;
					opacity: 0;
				}

				&:hover .card-content {
					bottom: 0;
					opacity: 1;
					z-index: 2;
					background: #000;
				}

				&:hover .gallery__image-wrapper img {
					transform: scale(1.1) translateY(-50%);
				}

				&:hover .ff-canvas {
					transform: scale(1.1) translateY(-50%);
				}

				&:hover .card-image__emotes {
					top: 15px;
					right: 15px;
				}

				&:hover .card-image__price {
					bottom: 62px;
				}
			}
		}
	}
}
</style>