<template>
  <component :is="is" class="profile-link__wrapper">
    <router-link :to="{ name: 'profile', params: { id: address } }">
      <Identity :address="address" :inline="true" :verticalAlign="true" />
    </router-link>
    <a :href="`https://kusama.subscan.io/account/${address}`" target="_blank">
      <figure class="image is-24x24 subscan__less-margin">
        <img :src="require('@/assets/subscan.svg')" />
      </figure>
    </a>
  </component>
</template>

<script lang="ts" >
import { Component, Prop, Vue, Mixins } from 'vue-property-decorator';
import InlineMixin from '@/utils/mixins/inlineMixin';
import isShareMode from '@/utils/isShareMode';

const components = {
  Identity: () => import('@/components/shared/format/Identity.vue')
};

@Component({ components })
export default class ProfileLink extends Mixins(InlineMixin) {
  @Prop() public address!: string;

  get sharingMode() {
    return isShareMode
  }
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
