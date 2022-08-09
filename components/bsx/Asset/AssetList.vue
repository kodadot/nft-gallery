<template>
  <div>
    <div class="column is-8 is-offset-2">
      <h1 class="title is-2 has-text-centered">
        {{ $t('Assets') }}
      </h1>
    </div>
    <Loader v-model="isLoading" :status="status" />
    <AssetTable
      :assetList="assetList"
      :accountId="accountId"
      @select="handleTokenSelect"
      :currentAsset="currentAsset" />
  </div>
</template>

<script lang="ts">
import { Component, mixins, Prop, Vue, Watch } from 'nuxt-property-decorator'
import { useApollo } from '~/utils/config/useApollo'
import AuthMixin from '~/utils/mixins/authMixin'
import PrefixMixin from '~/utils/mixins/prefixMixin'
import assetListByIdList from '@/queries/subsquid/bsx/assetListByIdList.graphql'
import { notificationTypes, showNotification } from '~/utils/notification'
import { AssetItem, AssetListQueryResponse } from './types'
import shouldUpdate from '~/utils/shouldUpdate'
import MetaTransactionMixin from '~/utils/mixins/metaMixin'
import { setDefaultFeeToken } from '@/utils/api/bsx/extrinsics'
import { getAssetIdByAccount, getAsssetBalance } from '~/utils/api/bsx/query'
import { mapToId } from '~/utils/mappers'

@Component({
  components: {
    Loader: () => import('@/components/shared/Loader.vue'),
    AssetTable: () => import('@/components/bsx/Asset/AssetTable.vue'),
  },
})
export default class AssetList extends mixins(
  AuthMixin,
  PrefixMixin,
  MetaTransactionMixin
) {
  protected assetList: AssetItem[] = []
  protected currentAsset = '0'

  private async loadAssets() {
    try {
      const { assetList } = await useApollo<this, AssetListQueryResponse>(
        this.$apollo,
        this.client,
        assetListByIdList
      )
      console.log(assetList)
      this.assetList = assetList
      this.fetchAccountBalance()
    } catch (e) {
      console.warn(e)
      showNotification('Unable to load assets')
    }
  }

  private async fetchAccountBalance() {
    const api = await this.useApi()
    const mapper = (id: string) => getAsssetBalance(api, this.accountId, id)
    this.assetList.map(mapToId).map(mapper).forEach(this.updatedBalanceFor)
  }

  private async updatedBalanceFor(balance: Promise<string>, index: number) {
    try {
      this.$set(this.assetList, index, {
        ...this.assetList[index],
        balance: await balance,
      })
    } catch (e) {
      console.warn('Unable to fetch balance', e)
    }
  }

  private async fetchCurrentToken(): Promise<void> {
    const api = await this.useApi()
    const currentToken = await getAssetIdByAccount(api, this.accountId)
    this.currentAsset = currentToken
  }

  protected async handleTokenSelect(id: string) {
    const api = await this.useApi()
    const { call, args } = setDefaultFeeToken(api, id)
    this.howAboutToExecute(this.accountId, call, args, (blockNumber) => {
      showNotification(
        `[ASSET] Since block ${blockNumber}, you pay in different token`,
        notificationTypes.success
      )
      this.fetchCurrentToken()
    })
  }

  @Watch('accountId', { immediate: true })
  public onAccountIdChange(value: string, oldValue: string) {
    console.log('onAccountIdChange', value, oldValue)
    if (shouldUpdate(value, oldValue)) {
      this.loadAssets()
      this.fetchCurrentToken()
    }
  }
}
</script>
