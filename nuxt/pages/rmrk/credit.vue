<template>
    <Credit />
</template>

<script lang="ts" >
import { Component, Vue } from 'vue-property-decorator';
import Credit from '@/components/rmrk/Credit/Credit.vue'

@Component({
    components: {
      Credit
    }
})

export default class CreditPage extends Vue {
}
</script>
