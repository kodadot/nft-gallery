<template>
  <AdminPanel />
</template>

<script lang="ts" >
import { Component, Vue } from 'nuxt-property-decorator'
import AdminPanel from '@/components/rmrk/Create/Admin/AdminPanel.vue'

@Component({
  components: {
    AdminPanel
  }
})

export default class TransferPage extends Vue {
}
</script>
