<template>
  <section
    class="landing-search is-flex is-flex-direction-column is-justify-content-center is-align-items-center">
    <div class="title">
      <span>Discover,</span> Collect <span> And Sell</span>
    </div>
    <img class="sub-title" src="/kusama-nfts.png" />
    <LazySearch
      hide-filter
      show-default-suggestions
      class="landing-search-bar is-flex-grow-1 pb-0 mb-2"
      search-column-class="is-flex-grow-1" />
    <div class="if-flex is-flex-grow-1 mb-4">
      <span
        v-for="chain in chainList"
        :key="chain.value"
        :class="{
          'mr-4': true,
          'chain-option': true,
          active: urlPrefix === chain.value,
        }">
        {{ chain.text }}
      </span>
    </div>
    <img
      class="landing-search-left is-hidden-touch"
      src="/landing-search-left.svg" />
    <img
      class="landing-search-right is-hidden-touch"
      src="/landing-search-right.svg" />
  </section>
</template>

<script lang="ts" setup>
import { Option } from '@kodadot1/vuex-options/dist/types'

import { chainTestList } from '~/utils/constants'

const { urlPrefix } = usePrefix()
const { $store } = useNuxtApp()

const chainList = computed(() => {
  const availableUrlPrefixes: Option[] = $store.getters['availableUrlPrefixes']
  return availableUrlPrefixes.filter(
    (urlPrefix) =>
      !chainTestList.includes(urlPrefix.value as string) &&
      urlPrefix.value !== 'bsx'
  )
})
</script>

<style lang="scss">
@import '@/styles/abstracts/variables';

.landing-search {
  // position: relative;
  height: 334px;
  width: 100vw;
  padding: 0 300px;

  .title {
    font-weight: 700;
    font-size: 48px;
    line-height: 56px;
    word-break: keep-all;
    margin-top: 60px;
    text-align: center;
  }
  .sub-title {
    width: 320px;
    height: 46px;
    margin-bottom: 38px;
  }

  .landing-search-bar {
    width: 602px;
  }

  .landing-search-left {
    position: absolute;
    left: 0;
    top: 100px;
    height: 334px;
  }
  .landing-search-right {
    position: absolute;
    right: 0;
    top: 100px;
    height: 334px;
  }

  .chain-option {
    font-weight: 400;
    font-size: 20px;
    line-height: 23px;
    color: $grey;
    width: max-content;
    &.active {
      font-weight: 700;
      color: $dark;
    }
  }

  @include touch {
    padding: 0;

    .landing-search-bar {
      width: 70%;
    }
  }
  @include mobile {
    .title {
      width: 250px;
    }
    .landing-search-bar {
      width: 90%;
    }
  }
}
</style>
