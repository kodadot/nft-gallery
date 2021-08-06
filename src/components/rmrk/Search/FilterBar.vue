<template>
  <div>
    <b-button
      v-for="(category, key) in categories"
      v-bind:key="key"
      type="is-info"
      class="ml-2 my-2"
    >
      {{ category }}
    </b-button>
    <hr />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { Categories } from './helper';

@Component({})
export default class FilterBar extends Vue {
  private categories = Categories;
}
</script>