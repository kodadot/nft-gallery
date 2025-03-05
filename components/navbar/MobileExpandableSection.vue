<template>
  <div
    v-if="!isOpened"
    class="navbar-item"
    @click.stop="isOpened = !isOpened"
  >
    <span>
      {{ title }}
      <KIcon
        v-if="icon"
        :name="icon"
      />
    </span>
    <KIcon
      class="icon--right"
      name="i-mdi:chevron-right"
    />
  </div>
  <div
    v-else
    class="navbar-item--fullpage"
  >
    <div
      class="navbar-item navbar-item--reverse"
      @click.stop="close"
    >
      <KIcon name="i-mdi:chevron-left" />
      {{ title }}
    </div>
    <div
      :class="{
        'navbar-item': !noPadding,
        'navbar-item-body--no-padding': noPadding,
      }"
      class="navbar-item-body"
    >
      <slot @closeMobileSubMenu="close" />
    </div>
  </div>
</template>

<script lang="ts" setup>
defineProps({
  title: {
    type: String,
    default: '',
  },
  icon: {
    type: String,
    default: '',
  },
  noPadding: {
    type: Boolean,
    default: false,
  },
})

const isOpened = ref(false)

const close = (): void => {
  isOpened.value = false
}
</script>
