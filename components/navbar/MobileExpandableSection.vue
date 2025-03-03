<template>
  <div
    v-if="!isOpened"
    class="navbar-item"
    @click.stop="isOpened = !isOpened"
  >
    <span>
      {{ title }}
      <Icon
        v-if="icon"
        :name="icon"
        class="text-2xl"
      />
    </span>
    <Icon
      name="i-mdi:chevron-right"
      class="text-2xl icon--right"
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
      <Icon
        name="i-mdi:chevron-left"
        class="text-2xl"
      />
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
  iconFamily: {
    type: String,
    default: 'fasr',
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
