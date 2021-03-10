<template>
  <div
    v-if="price"
    class="kusama-price"
  >
    KSM: {{ price }}$
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import axios from 'axios'

@Component
export default class KusamaPrice extends Vue {
  private price: number = 0

  async created() {
    try {
      const { data } = await axios.get('https://api.coingecko.com/api/v3/simple/price', {
        params: {
          ids: 'kusama',
          vs_currencies: 'usd'
        }
      })

      this.price = data.kusama.usd
    } catch (error) {
      console.log(error)
    }
  }
}
</script>

<style lang="scss">
  .kusama-price {
    position: fixed;
    right: 16px;
    bottom: 16px;
  }
</style>
