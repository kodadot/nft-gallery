<template>
    <div>
      <b-collapse class="card" animation="slide" 
        aria-id="contentIdForA11y3" :open="false">
        <template #trigger="props">
          <div
            class="card-header"
            role="button"
            aria-controls="contentIdForA11y3">
            <p class="card-header-title is-size-1">
              <span v-if="!isLoading">
                {{ nft.name }}
              </span>
              <b-skeleton height="100px" size="is-large" :active="isLoading"></b-skeleton>
            </p>
            <a class="card-header-icon">
              <b-icon
                :icon="props.open ? 'chevron-up' : 'chevron-down'">
              </b-icon>
            </a>
          </div>
        </template>
        <div class="card-content">
          <div class="content">
            <p class="title is-size-4">
              {{ $t('collection') }}
            </p>
            <p class="subtitle is-size-6"> 
              {{ nft.collection }}
            </p>
            <p class="title is-size-4">
              {{ $t('owner') }}
            </p>
            <p class="subtitle is-size-7">
              <a :href="`https://kusama.subscan.io/account/${nft.currentOwner}`" target="_blank"><Identity :address="nft.currentOwner" /></a>
            </p>
          </div>
        </div>
      </b-collapse>
  </div>
</template>

<script lang="ts" >
import { Component, Prop, Vue } from 'vue-property-decorator';
import Identity from '@/components/shared/format/Identity.vue'

const components = {
  Identity
}

@Component({ components })
export default class Name extends Vue {
  @Prop() public nft!: any;
  @Prop() public isLoading!: boolean;
}
</script>
