<template>
  <div>
    <LinkResolver
      class="profile-link__wrapper"
      :route="`/${urlPrefix}/u`"
      :param="address"
      link="u">
      <Identity :address="address" :inline="true" :vertical-align="true" />
      <template #extra>
        <a
          :href="`https://kusama.subscan.io/account/${address}`"
          target="_blank"
          rel="noopener noreferrer">
          <figure class="image is-24x24 subscan__less-margin">
            <img alt="subscan" src="/subscan.svg" />
          </figure>
        </a>
      </template>
    </LinkResolver>
    <template v-if="showTwitter">
      <Identity
        :address="address"
        :show-twitter="showTwitter"
        :vertical-align="true"
        class="pt-2" />
    </template>
    <template v-if="showDiscord">
      <Identity :address="address" :show-discord="showDiscord" class="pt-2" />
    </template>
    <a
      :href="`https://dotscanner.com/Kusama/account/${address}`"
      target="_blank"
      rel="noopener noreferrer"
      class="is-flex is-align-items-center pt-2">
      <figure class="image is-24x24 mr-2">
        <img alt="dotscanner" src="/dotscanner.svg" />
      </figure>
      {{ shortendId }}
    </a>
  </div>
</template>

<script lang="ts">
import { Component, Prop, mixins } from 'nuxt-property-decorator'
import InlineMixin from '@/utils/mixins/inlineMixin'
import PrefixMixin from '@/utils/mixins/prefixMixin'
import shortAddress from '@/utils/shortAddress'

const components = {
  Identity: () => import('@/components/shared/format/Identity.vue'),
  LinkResolver: () => import('@/components/shared/LinkResolver.vue'),
}

@Component({ components })
export default class ProfileLink extends mixins(InlineMixin, PrefixMixin) {
  @Prop() public address!: string
  @Prop(Boolean) public showTwitter!: boolean
  @Prop(Boolean) public showDiscord!: boolean
  get shortendId(): string {
    return shortAddress(this.address)
  }
}
</script>

<style scoped>
.subscan__less-margin {
  margin: auto 0.5em auto 0;
}

.profile-link__wrapper {
  display: flex;
}
</style>
