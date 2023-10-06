<template>
  <div class="control neo-radio-button" :class="{ 'is-expanded': expanded }">
    <label
      ref="label"
      class="button"
      :class="labelClass"
      :disabled="disabledNull"
      @click="focus">
      <slot />
      <input
        ref="input"
        v-model="computedValue"
        type="radio"
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
    expanded: Boolean,
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
          'is-rounded': this.rounded,
        },
      ]
    },
  },
}
</script>

<style lang="scss">
@import '../../scss/_theme.scss';
@import '../../scss/variable.scss';

.neo-radio-button {
  input[type='radio'] {
    display: none;
  }

  label {
    display: flex;
    align-items: center;
    justify-content: center;

    &.button {
      text-transform: capitalize;
      @include ktheme() {
        border-color: theme('background-color-inverse');
      }
    }

    &.is-selected {
      @include ktheme() {
        color: theme('text-color-inverse');
        background-color: theme('background-color-inverse');
      }
    }

    &.is-rounded {
      border-radius: $radius-rounded;
    }
  }
}
</style>
