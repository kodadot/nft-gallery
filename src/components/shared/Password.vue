<template>
  <b-field label="password 🤫 magic spell" class="password-wrapper">
    <b-input v-model="password" type="password" password-reveal />
  </b-field>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';

export default class Password extends Vue {
  @Prop() public value!: string;

  get password() {
    return this.value;
  }

  set password(value: string) {
    this.$emit('input', value)
  }
}
</script>
