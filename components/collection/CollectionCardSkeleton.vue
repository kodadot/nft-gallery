<template>
  <div class="collection-card card cursor-default">
    <b-skeleton :rounded="false" height="112px" />

    <div class="collection-detail">
      <div class="collection-detail__header is-12 is-flex">
        <div class="collection-detail__header-image-wrapper">
          <div class="w-full h-full collection-card__image-wrapper-sub">
            <b-skeleton
              :rounded="false"
              height="100%"
              width="100%"
              position="is-centered" />
          </div>
        </div>
        <span class="collection-detail__name">
          <b-skeleton size="is-medium" width="100px" />
        </span>
      </div>
      <div class="is-flex is-justify-content-space-around is-vcentered">
        <div
          v-for="n in DESC_SKELETON_COUNT"
          :key="n"
          class="is-flex is-align-items-center detail-item column px-5">
          <b-skeleton size="is-medium" position="is-centered" width="100%" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const DESC_SKELETON_COUNT = 3
</script>

<style lang="scss" scoped>
.cursor-default {
  cursor: default;
}

.collection-detail__header-image-wrapper .b-skeleton {
  height: 100%;
}
</style>
