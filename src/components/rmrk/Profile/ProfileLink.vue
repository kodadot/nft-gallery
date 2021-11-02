<template>
  <div>
    <LinkResolver class="profile-link__wrapper" route="profile" :param="address" link="u">
      <Identity :address="address" :inline="true" :verticalAlign="true" />
      <template v-slot:extra>
        <a :href="`https://kusama.subscan.io/account/${address}`" target="_blank" rel="noopener noreferrer">
          <figure class="image is-24x24 subscan__less-margin">
            <img alt="subscan" src="/subscan.svg" />
          </figure>
        </a>
      </template>
    </LinkResolver>
    <Identity v-if="showTwitter" :address="address" :showTwitter="showTwitter" :verticalAlign="false" class="pt-2" />
    <template>
      <a :href="`https://sub.id/#/${address}`" target="_blank" rel="noopener noreferrer" 
              class="is-flex pt-2">
        <figure class="image is-24x24 subscan__less-margin">
          <img alt="subscan" src="/subscan.svg" />
        </figure>
          sub id
      </a>
    </template>
  </div>
</template>

<script lang="ts" >
import { Component, Prop, Mixins } from 'vue-property-decorator'
import InlineMixin from '@/utils/mixins/inlineMixin'

const components = {
  Identity: () => import('@/components/shared/format/Identity.vue'),
  LinkResolver: () => import('@/components/shared/LinkResolver.vue')
}

@Component({ components })
export default class ProfileLink extends Mixins(InlineMixin) {
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
