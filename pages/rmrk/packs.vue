<template>
  <Packs />
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator';
import Packs from '@/components/rmrk/Pack/Packs.vue';

@Component({
  components: {
    Packs,
  },
})
export default class PacksPage extends Vue {}
</script>
