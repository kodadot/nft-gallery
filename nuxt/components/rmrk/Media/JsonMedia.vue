<template>
  <div>
    <div
      v-for="item in data"
      :key="item.key"
    >
      <div>
        <b>{{ item.key }}</b>: {{ item.value }}
      </div>
    </div>
  </div>
</template>

<script lang="ts" >
import { Component, Prop, Vue } from 'nuxt-property-decorator'
import api from '@/fetch'

@Component({})
export default class Unknown extends Vue {
  @Prop() public src!: string;
  @Prop() public mimeType!: string;
  private data: { key: string; value: string }[] = [];

  private async mounted() {
    if (this.src) {
      const { data } = await api.get(this.src)
      console.log('data', data)
      this.data = Object.entries(data).map(([key, value]) => ({
        key,
        value: JSON.stringify(value)
      }))
    }
  }
}
</script>
