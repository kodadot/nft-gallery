<template>
  <div>
    <b-tabs v-model="activeTab" @input="tabClick">
      <b-tab-item label="Accounts">
        
      </b-tab-item>
      <b-tab-item label="Contacts">
        
      </b-tab-item>
    </b-tabs>
    <router-view 
    
    >
    </router-view>
  </div>
</template>
<script lang="ts" >
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import Accounts from '@/components/accounts/Accounts.vue';
import Addressbook from '@/components/addressbook/Addressbook.vue';
import Router from 'vue-router';

@Component({
  components: {
    Accounts,
    Addressbook
  }
})
export default class AccountsMain extends Vue {
  private activeTab: number = 0;
  
  @Watch('$route.params.tab')
  private async reflect() {
    if (typeof this.$route.params.tab === 'number') {
      this.activeTab = Number(this.$route.params.tab);
    }
  }

  private async tabClick(): Promise<void> {
    this.$router.replace(`/accounts/${this.activeTab}`)
  }

  private async mounted(): Promise<void> {
    this.reflect();
  }
}
</script>
