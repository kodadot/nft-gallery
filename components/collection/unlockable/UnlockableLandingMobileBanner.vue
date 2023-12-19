<template>
  <div
    class="container is-fluid flex border-top justify-between items-center py-3 mt-7">
    <div class="flex items-center">
      <img
        width="42"
        height="42"
        src="/drop/unlockable-pulse-static.svg"
        alt="unlockable icon" />
      <span>{{ $t('mint.unlockable.mintLive') }}</span>
    </div>
    <nuxt-link class="has-text-weight-bold" :to="DEFAULT_DROP">
      {{ $t('mint.unlockable.takeMe') }}
    </nuxt-link>
  </div>
</template>
