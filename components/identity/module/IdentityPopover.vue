<template>
  <tippy
    class="tippy-container"
    :append-to="body"
    boundary="viewport"
    :delay="0"
    data-testid="identity-tippy-link"
    :on-show="() => (showContent = props.showPopover)"
  >
    <slot name="content" />

    <template #content>
      <div
        v-if="showContent"
        class="popover-content-container p-5"
        data-testid="identity-popover-container"
      >
        <IdentityPopoverHeader @refresh="refresh" />
        <hr class="!my-4 !bg-neutral-3 dark:!bg-neutral-11">
        <IdentityPopoverFooter ref="footer" />
      </div>
    </template>
  </tippy>
</template>

<script lang="ts" setup>
import IdentityPopoverHeader from './IdentityPopoverHeader.vue'
import IdentityPopoverFooter from './IdentityPopoverFooter.vue'

const props = withDefaults(
  defineProps<{
    showPopover: boolean
  }>(),
  {
    showPopover: true,
  },
)

const footer = ref()
const body = ref(document.body)
const showContent = ref(false)

const refresh = () => footer.value?.refresh()
</script>

<style lang="scss" scoped>
.tippy-container {
  display: inline-block;
}

.popover-content-container {
  width: 300px;
  background: var(--background-color);
  box-shadow: var(--primary-shadow);
  border: 1px solid var(--border-color);
}
</style>
