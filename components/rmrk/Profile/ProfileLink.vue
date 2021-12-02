<template>
  <div>
    <LinkResolver
      class="profile-link__wrapper"
      :route="`/${urlPrefix}/u`"
      :param="address"
      link="u"
    >
      <Identity
        :address="address"
        :inline="true"
        :vertical-align="true"
      />
      <template #extra>
        <a
          :href="`https://kusama.subscan.io/account/${address}`"
          target="_blank"
          rel="noopener noreferrer"
        >
          <figure class="image is-24x24 subscan__less-margin">
            <img
              alt="subscan"
              src="/subscan.svg"
            >
          </figure>
        </a>
      </template>
    </LinkResolver>
    <template v-if="showTwitter">
      <Identity
        :address="address"
        :show-twitter="showTwitter"
        :vertical-align="true"
        class="pt-2"
      />
    </template>
  </div>
</template>

<script lang="ts" >
import { Component, Prop, mixins } from 'nuxt-property-decorator'
import InlineMixin from '@/utils/mixins/inlineMixin'
import PrefixMixin from '@/utils/mixins/prefixMixin'

const components = {
  Identity: () => import('@/components/shared/format/Identity.vue'),
  LinkResolver: () => import('@/components/shared/LinkResolver.vue')
}

@Component({ components })
export default class ProfileLink extends mixins(InlineMixin, PrefixMixin) {
  @Prop() public address!: string;
  @Prop() public showTwitter!: boolean;
}
</script>

<style scoped>
.subscan__less-margin {
  margin: auto .5em auto 0;
}

.profile-link__wrapper {
  display: flex;
}
</style>
