<template>
	<div class="pack-item-wrapper container">
		<div class="columns">
			<div class="column">
				<h1 class="title">Collection {{ name }}</h1>
			</div>
			<div class="column">
				<p class="subtitle">
					Creator
					<ProfileLink
						:address="issuer"
						:inline="true"
						:showTwitter="true"
					/>
				</p>
				<p class="subtitle" v-if="owner">
					Owner <ProfileLink :address="owner" :inline="true" />
				</p>
			</div>
			<div class="column is-2">
				<Sharing
					v-if="sharingVisible"
					label="Check this awesome Collection on %23KusamaNetwork %23KodaDot"
					:iframe="iframeSettings"
				/>
			</div>
		</div>

		<nav class="level is-mobile">
			<div class="level-item has-text-centered">
				<div>
					<p class="heading">Items</p>
					<p class="title">{{collectionLength}}</p>
				</div>
			</div>
			<div class="level-item has-text-centered">
				<div>
					<p class="heading">Owners</p>
					<p class="title">{{collectionSoldedNFT}}</p>
				</div>
			</div>
			<div class="level-item has-text-centered">
				<div>
					<p class="heading">Floor price</p>
					<p class="title"><Money :value="collectionFloorPrice" inline /></p>
				</div>
			</div>
			<div class="level-item has-text-centered">
				<div>
					<p class="heading">Volume traded</p>
					<p class="title"><Money :value="collectionSoldedNFT * collectionFloorPrice" inline /></p>
				</div>
			</div>
		</nav>

		<GalleryCardList :items="collection.nfts" />
	</div>
</template>

<script lang="ts" >
import { emptyObject } from '@/utils/empty'
import { notificationTypes, showNotification } from '@/utils/notification'
import { Component, Vue } from 'vue-property-decorator'
import { CollectionWithMeta, NFTWithMeta, Collection } from '../service/scheme'
import { sanitizeIpfsUrl, fetchCollectionMetadata } from '../utils'
import isShareMode from '@/utils/isShareMode'
import collectionById from '@/queries/collectionById.graphql'
import { CollectionMetadata } from '../types'


const components = {
	GalleryCardList: () =>
		import('@/components/rmrk/Gallery/GalleryCardList.vue'),
	Sharing: () => import('@/components/rmrk/Gallery/Item/Sharing.vue'),
	ProfileLink: () => import('@/components/rmrk/Profile/ProfileLink.vue'),
  Money: () => import('@/components/shared/format/Money.vue'),
}

@Component<CollectionItem>({
	metaInfo() {
		return {
			title: 'KodaDot cares about environmental impact',
			titleTemplate: '%s | Low Carbon NFTs',
			meta: [
				{
					name: 'description',
					content: 'Creating Carbonless NFTs on Kusama',
				},
				{
					property: 'og:title',
					content:
						this.collection.name ||
						'KodaDot cares about environmental impact',
				},
				{
					property: 'og:url',
					content: 'https://nft.kodadot.xyz/' + this.$route.path,
				},
				{
					property: 'og:image',
					content:
						this.meta.image ||
						'https://nft.kodadot.xyz/kodadot_carbonless.jpg',
				},
				{
					property: 'og:description',
					content:
						this.meta.description ||
						'Creating Carbonless NFTs on Kusama',
				},
				{ property: 'twitter:card', content: 'summary_large_image' },
				{
					property: 'twitter:title',
					content:
						this.collection.name ||
						'KodaDOT cares about environmental impact',
				},
				{
					property: 'twitter:description',
					content:
						this.meta.description ||
						'Creating Carbonless NFTs on Kusama',
				},
				{
					property: 'twitter:image',
					content:
						this.meta.image ||
						'https://nft.kodadot.xyz/kodadot_carbonless.jpg',
				},
			],
		}
	},
	components,
})
export default class CollectionItem extends Vue {
	private id: string = ''
	private collection: CollectionWithMeta = emptyObject<CollectionWithMeta>()
	private nfts: NFTWithMeta[] = []
	private isLoading: boolean = false
	public meta: CollectionMetadata = emptyObject<CollectionMetadata>()

	get name() {
		return this.collection.name || this.id
	}

	get issuer() {
		return this.collection.issuer || ''
	}

	get owner() {
		return this.collection.issuer === (this.collection as any).currentOwner
			? ''
			: (this.collection as any).currentOwner
	}

  get collectionLength() {
    return this.collection.nfts.length
  }

  get collectionFloorPrice() {
    return Math.min(...this.collection.nfts.map(nft => nft.price).filter(price => price !== '0'))
  }

  get collectionSoldedNFT() {
    return this.collection.nfts.map(nft => nft.price).filter(price => price == 0).length
  }

  get collectionTradedVol() {
    return Math.floor(Math.random() * 10)
  }

	get sharingVisible() {
		return !isShareMode
	}

	public created() {
		this.checkId()
		this.$apollo.addSmartQuery('collection', {
			query: collectionById,
			variables: {
				id: this.id,
			},
			update: ({ collectionEntity }) => {
				return {
					...collectionEntity,
					nfts: collectionEntity.nfts.nodes,
				}
			},
			result: () => this.fetchMetadata(),
		})
	}

	public async fetchMetadata() {
		console.log(this.collection['metadata'], !this.meta['image'])
		if (this.collection['metadata'] && !this.meta['image']) {
			const meta = await fetchCollectionMetadata(this.collection)
			this.meta = {
				...meta,
				image: sanitizeIpfsUrl(meta.image || ''),
			}
      console.log(this.collection)
		}
	}

	public checkId() {
		if (this.$route.params.id) {
			this.id = this.$route.params.id
		}
	}

	get iframeSettings() {
		return { width: '100%', height: '100vh' }
	}

	collectionMeta(collection: Collection) {
		fetchCollectionMetadata(collection).then(
			(meta) =>
				(this.collection = {
					...collection,
					...meta,
					image: sanitizeIpfsUrl(meta.image || ''),
				}),
			(e) => {
				showNotification(`${e}`, notificationTypes.danger)
				console.warn(e)
			}
		)
	}
}
</script>
