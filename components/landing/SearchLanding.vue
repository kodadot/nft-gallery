<template>
  <section
    class="landing-search is-flex is-flex-direction-column is-justify-content-center is-align-items-center">
    <div class="title"><span>Discover,</span> Collect And Sell</div>
    <img class="sub-title" src="/kusama-nfts.png" />
    <LazySearch
      hide-filter
      show-default-suggestions
      class="landing-search-bar is-flex-grow-1 pb-0"
      search-column-class="is-flex-grow-1" />
    <img
      class="landing-search-left is-hidden-touch"
      src="/landing-search-left.svg" />
    <img
      class="landing-search-right is-hidden-touch"
      src="/landing-search-right.svg" />
  </section>
</template>

<script lang="ts" setup>
import {
  getCloudflareImageLinks,
  processMetadata,
} from '@/utils/cachingStrategy'
import { fastExtract } from '@/utils/ipfs'
import { mapOnlyMetadata } from '@/utils/mappers'

import { SomethingWithMeta, getSanitizer } from '@/components/rmrk/utils'
import { CollectionMetadata } from '@/components/rmrk/types'
import { Collection } from '@/components/unique/types'

const { urlPrefix } = usePrefix()
</script>

<style lang="scss">
// move to scss component
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
  }
  .sub-title {
    width: 320px;
    height: 46px;
    margin-top: 10px;
    margin-bottom: 38px;
  }

  .landing-search-bar {
    width: 554px;
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
}
</style>
