<template>
<div>
  <LinkResolver class="profile-link__wrapper" route="profile" :param="address" link="u">
    <Identity :address="address" :inline="true" :verticalAlign="true" />
    <template v-slot:extra>
      <a :href="`https://kusama.subscan.io/account/${address}`" target="_blank">
        <figure class="image is-24x24 subscan__less-margin">
          <img :src="require('@/assets/subscan.svg')" />
        </figure>
      </a>
    </template>
  </LinkResolver>
  <div v-if="showTwitter">
    <Identity :address="address" :inline="true" :showTwitter="showTwitter" :verticalAlign="true" />
	</div>
</div>

</template>

<script lang="ts" >
import { Component, Prop, Mixins } from 'vue-property-decorator';
import InlineMixin from '@/utils/mixins/inlineMixin';

const components = {
  Identity: () => import('@/components/shared/format/Identity.vue'),
  LinkResolver: () => import('@/components/shared/LinkResolver.vue')
};

@Component({ components })
export default class ProfileLink extends Mixins(InlineMixin) {
  @Prop() public address!: string;
  @Prop() public showTwitter!: boolean;

}
</script>

<style scoped>
.subscan__less-margin {
  margin: auto 0.5em;
}

.profile-link__wrapper {
  display: flex;
}
</style>
