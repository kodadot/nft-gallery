<template>
  <div>
    <Loader v-model="isLoading" />
    <div class="columns is-vcentered">
      <div class="column is-four-fifths">
        <h1 class="title is-2">Newest List</h1>
        <p class="subtitle is-size-5">Discover the latest items on sale</p>
      </div>
      <div class="column has-text-right">
        <b-button
          tag="nuxt-link"
          type="is-primary"
          inverted
          outlined
          icon-right="chevron-right"
          to="/rmrk/explore?search=&sort=UPDATED_AT_DESC&tab=GALLERY">
          {{ $t('helper.seeMore') }}
        </b-button>
      </div>
    </div>

    <CarouselCardList :nfts="nfts" />
  </div>
</template>

<script lang="ts">
import { Component, mixins, Prop } from 'nuxt-property-decorator'
import {
  getCloudflareImageLinks,
  getProperImageLink,
} from '~/utils/cachingStrategy'
import { formatDistanceToNow } from 'date-fns'
import lastNftListByEvent from '@/queries/rmrk/subsquid/lastNftListByEvent.graphql'
import { fallbackMetaByNftEvent } from '@/utils/carousel'
import PrefixMixin from '~/utils/mixins/prefixMixin'
import AuthMixin from '@/utils/mixins/authMixin'

const components = {
  CarouselCardList: () => import('@/components/base/CarouselCardList.vue'),
  Loader: () => import('@/components/shared/Loader.vue'),
}

@Component<NewestList>({
  components,
})
export default class NewestList extends mixins(PrefixMixin, AuthMixin) {
  @Prop({ type: Array, required: false, default: () => [] })
  passionList: string[]

  private nfts: any[] = []
  private events: any[] = []
  private total = 0

  get isLoading(): boolean {
    return false
  }

  mounted() {
    setTimeout(async () => {
      const queryVariables = {
        limit: 10,
        event: 'LIST',
        and: {
          meta_not_eq: '0',
        },
      }
      if (this.isLogIn) {
        queryVariables.and.nft = {
          issuer_in: this.passionList,
        }
      }
      const result = await this.$apollo
        .query<{
          events: { meta; nft: { meta: { id; image } } }
        }>({
          query: lastNftListByEvent,
          client: this.client,
          variables: queryVariables,
        })
        .catch((e) => {
          this.$consola.error(e)
          return { data: null }
        })

      if (result.data) {
        this.handleResult(result)
      }
    }, 500)
  }

  protected async handleResult({ data }: any) {
    this.events = [...data.events]
    await fallbackMetaByNftEvent(this.events)
    const images = await getCloudflareImageLinks(
      this.events.map((event) => event.nft.meta.id)
    )
    const imageOf = getProperImageLink(images)
    this.nfts = this.events.map((e: any) => ({
      price: e.meta,
      ...e.nft,
      timestamp: formatDistanceToNow(new Date(e.timestamp), {
        addSuffix: true,
      }),
      image: imageOf(e.nft.meta.id, e.nft.meta.image),
    }))
  }
}
</script>
