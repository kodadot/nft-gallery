<template>
  <b-field label="password 🤫 magic spell" class="password-wrapper">
    <b-input v-model="password" type="password" password-reveal> </b-input>
  </b-field>
</template>

<script lang="ts">
import { Component, Vue, PropSync } from 'vue-property-decorator';

export default class Password extends Vue {
  @PropSync('password', { type: String }) public password!: string;
}
</script>
