<template>
  <div
    class="container is-fluid is-flex border-top is-justify-content-space-between is-align-items-center py-3 mt-7">
    <div class="is-flex is-align-items-center">
      <img
        width="42"
        height="42"
        src="/drop/unlockable-pulse-static.svg"
        alt="unlockable icon" />
      <span>{{ $t('mint.unlockable.mintLive') }}</span>
    </div>
    <nuxt-link class="has-text-weight-bold" to="/ahp/drops/motherboard">
      {{ $t('mint.unlockable.takeMe') }}
    </nuxt-link>
  </div>
</template>
