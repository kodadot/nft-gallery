<template>
  <div class="popover-stats-container pt-3">
    <div class="has-text-centered">
      <p class="has-text-weight-bold is-size-6" data-cy="identity-collected">
        {{ totalCollected }}
      </p>
      <span class="is-size-7 is-uppercase">{{ $t('profile.collected') }}</span>
    </div>
    <div class="has-text-centered">
      <p class="has-text-weight-bold is-size-6" data-cy="identity-created">
        {{ totalCreated }}
      </p>
      <span class="is-size-7 is-uppercase">{{ $t('profile.created') }}</span>
    </div>
    <div class="has-text-centered">
      <p class="has-text-weight-bold is-size-6" data-cy="identity-sold">
        {{ totalSold }}
      </p>
      <span class="is-size-7 is-uppercase">{{ $t('profile.sold') }}</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import useIdentityStats from '../utils/useIdentityStats'

const address = inject('address')
const { totalCollected, totalCreated, totalSold } = useIdentityStats({
  address,
})
</script>

<style>
.popover-stats-container {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
}
</style>
