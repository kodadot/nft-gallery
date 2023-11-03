<template>
  <div
    class="is-flex border-top w-full is-justify-content-space-between is-align-items-center px-4 py-3 mt-7">
    <div class="is-flex is-align-items-center pl-1">
      <img
        width="42"
        height="42"
        src="/drop/unlockable-pulse-static.svg"
        alt="unlockable icon" />
      <span>{{ $t('mint.unlockable.freeDrop') }}</span>
    </div>
    <nuxt-link class="has-text-weight-bold pr-1" to="/ahk/drops/chained">
      {{ $t('mint.unlockable.takeMe') }}
    </nuxt-link>
  </div>
</template>
