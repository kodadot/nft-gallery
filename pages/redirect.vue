<template>
  <div>
    <div v-if="warn">
      {{ warn }}
    </div>
    <span>
      {{ redirectUrl }}
    </span>
    <div>
      you are redirecting to the external link which is not hosted by KodaDot,
      make sure it's safe!
    </div>
    <div>
      <NeoButton @click.native="redirect">Continue</NeoButton>
      <NeoButton @click.native="close">Close</NeoButton>
    </div>
  </div>
</template>

<script setup>
import { NeoButton } from '@kodadot1/brick'

const route = useRoute()
const redirectUrl = ref(route.query.redirect)
const warn = ref(route.query.warn)

function redirect() {
  // window.open is hooked,  use the origin _open instead
  window._open(redirectUrl.value, '_self')
}

function close() {
  window.close()
}
</script>

<style scoped lang="scss"></style>
