<template>
  <div>
    <b-dropdown v-if="!isMobile" aria-role="list" :triggers="['click']">
      <template #trigger>
        <div class="navbar-item">
          {{ $t('create') }}
        </div>
      </template>
      <b-dropdown-item has-link>
        <b-tooltip
          position="is-left"
          label="Start by creating your collection and add NFTs to it"
          class="navbar-item-tooltip">
          <nuxt-link data-cy="classic" :to="`/${urlPrefix}/create`">
            {{ $t('classic') }}
          </nuxt-link>
        </b-tooltip>
      </b-dropdown-item>
      <template v-if="chain === 'rmrk'">
        <b-dropdown-item has-link>
          <b-tooltip
            position="is-left"
            label="Simplified process to create your NFT in a single step"
            class="navbar-item-tooltip">
            <nuxt-link data-cy="simple" :to="`/${urlPrefix}/mint`">
              {{ $t('simple') }}
            </nuxt-link>
          </b-tooltip>
        </b-dropdown-item>
        <b-dropdown-item has-link>
          <b-tooltip
            position="is-left"
            label="AI powered process to create your NFT"
            class="navbar-item-tooltip">
            <nuxt-link data-cy="creative" :to="`/${urlPrefix}/creative`">
              {{ $t('creative') }}
            </nuxt-link>
          </b-tooltip>
        </b-dropdown-item>
      </template>
    </b-dropdown>

    <MobileExpandableSection
      v-if="isMobile"
      :no-padding="true"
      :title="$t('create')">
      <b-navbar-item
        data-cy="classic"
        :to="`/${urlPrefix}/create`"
        tag="nuxt-link">
        {{ $t('classic') }}
      </b-navbar-item>
      <b-navbar-item
        data-cy="simple"
        :to="`/${urlPrefix}/mint`"
        tag="nuxt-link">
        {{ $t('simple') }}
      </b-navbar-item>
      <b-navbar-item
        data-cy="creative"
        :to="`/${urlPrefix}/creative`"
        tag="nuxt-link">
        {{ $t('creative') }}
      </b-navbar-item>
    </MobileExpandableSection>
  </div>
</template>

<script lang="ts">
import { Component, Prop, mixins } from 'nuxt-property-decorator'
import { getChainTestList } from '~/utils/constants'
import PrefixMixin from '@/utils/mixins/prefixMixin'
import MobileExpandableSection from '@/components/navbar/MobileExpandableSection.vue'
import AuthMixin from '~~/utils/mixins/authMixin'
import { isMobileDevice } from '~~/utils/extension'

@Component({
  components: {
    MobileExpandableSection,
  },
})
export default class NavbarCreate extends mixins(PrefixMixin, AuthMixin) {
  @Prop({ type: String }) chain!: string

  public isMobile = window.innerWidth < 1024 ? true : isMobileDevice

  get options() {
    const availableUrlPrefixes = this.$store.getters['availableUrlPrefixes']

    if (!this.$config.dev) {
      return availableUrlPrefixes.filter(
        (urlPrefix) => !getChainTestList().includes(urlPrefix.value as string)
      )
    }
    return availableUrlPrefixes
  }
}
</script>
