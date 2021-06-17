<template>
  <b-button @click="$emit('click')">
    <span :style="{ display: 'flex' }">
      <figure class="image is-24x24 mr-2">
        <img :src="require('@/assets/subsocial.svg')" />
      </figure>
      <span>{{ $t("subsocial.post") }}</span>
    </span>
  </b-button>
</template>

<script lang="ts" >
import { Component, Vue } from 'vue-property-decorator';

@Component({})
export default class PostButton extends Vue {
}
</script>
