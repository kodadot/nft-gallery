<template>
  <div class="neo-radio-button">
    <label
      ref="label"
      :class="labelClass"
      :disabled="disabledNull"
      @click="focus">
      <slot />
      <input
        ref="input"
        v-model="computedValue"
        type="radio"
        class="hidden"
        :disabled="disabled"
        :required="required"
        :name="name"
        :value="nativeValue"
        @click.stop
        @focus="isFocused = true"
        @blur="isFocused = false" />
    </label>
  </div>
</template>

<script lang="ts">
import CheckRadioMixin from '@oruga-ui/oruga-next/src/utils/CheckRadioMixin'

export default {
  name: 'NeoRadioButton',
  mixins: [CheckRadioMixin],
  props: {
    type: {
      type: String,
      default: 'is-primary',
    },
    rounded: Boolean,
  },
  data() {
    return {
      isFocused: false,
    }
  },
  computed: {
    disabledNull() {
      if (!this.disabled) {
        return null
      }

      return this.disabled
    },
    isSelected() {
      return this.newValue === this.nativeValue
    },
    labelClass() {
      return [
        this.isSelected ? this.type : null,
        this.size,
        {
          'is-selected': this.isSelected,
          'is-disabled': this.disabled,
          'is-focused': this.isFocused,
          'rounded-full': this.rounded,
        },
      ]
    },
  },
}
</script>

<style lang="scss" scoped>
.neo-radio-button {
  label {
    @apply flex items-center justify-center text-base/normal h-10 rounded py-button-y px-button-x bg-background-color cursor-pointer capitalize border-default border-background-color-inverse;

    &.is-selected {
      @apply text-text-color-inverse bg-background-color-inverse;
    }

    &.rounded-full {
      @apply rounded-full;
    }
  }
}
</style>
