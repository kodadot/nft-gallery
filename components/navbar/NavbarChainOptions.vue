<template>
  <div>
    <span
      v-for="chain in availableChains"
      :key="chain.value"
      class="navbar-item"
      @click="changeChain(chain.value)"
    >
      <p class="menu-item mr-2">
        {{ chain.text }}
      </p>
    </span>
  </div>
</template>

<script lang="ts" setup>
const { availableChains } = useChain()
const { setUrlPrefix } = usePrefix()
const { redirectAfterChainChange } = useChainRedirect()

const emits = defineEmits(['select'])

const changeChain = (newChain) => {
  setUrlPrefix(newChain)
  redirectAfterChainChange(newChain)
  emits('select')
}
</script>
