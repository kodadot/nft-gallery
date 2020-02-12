<template>
  <div
    class="column happy-menu is-one-fifth is-one-third-mobile is-one-fifth-tablet"
    v-bind:class="{closed: isSidebarClosed }"
  >
    <figure class="image is-48x48 logo" @click="toggleSidebar">
      <img
        class="is-rounded"
        src="../assets/vue-polkadot.png"
        alt="vue-polkadot.js.org dashboard for Polkadot/Substrate chains"
      />
    </figure>
    <b-menu>
      <b-menu-list v-if="!isSidebarClosed" label="apiUrl" icon-pack="fa">
        <b-menu-item
          class="menu-item"
          v-for="row in sidebar"
          v-bind:key="row.name"
          @click="currentRow = row"
          :icon="row.icon"
          :label="row.name"
          :tag="row.tag"
          :to="row.to"
          :href="row.to"
        ></b-menu-item>
      </b-menu-list>
      <b-menu-list v-if="isSidebarClosed">
        <b-menu-item
          class="menu-item"
          v-for="row in sidebar"
          v-bind:key="row.name"
          @click="currentRow = row"
          :icon="row.icon"
          :tag="row.tag"
          :to="row.to"
          :href="row.to"
        ></b-menu-item>
      </b-menu-list>
    </b-menu>
    <b-switch v-if="!isSidebarClosed" v-model="showVerbose" 
      class="switchVerbose" type="is-danger">🕵️‍♂️</b-switch>
    <SettingInfo v-if="!isSidebarClosed && showVerbose" />

    <div class="toggleSidebar">
      <b-button class="closeSideBarBtn" v-if="!isSidebarClosed" 
        icon-left="angle-double-left" @click="toggleSidebar" rounded>
      </b-button>
      <b-button v-if="isSidebarClosed" icon-left="angle-double-right" 
        @click="toggleSidebar" rounded>
      </b-button>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import SettingInfo from '@/components/shared/SettingInfo.vue';

@Component({
  components: {
    SettingInfo,
  },
})
export default class SidebarMenu extends Vue {
  public sidebar: any = [
    {
      name: 'Explorer',
      icon: 'dice-d20',
      to: '/explorer',
      tag: 'router-link',
    },
    {
      name: 'Accounts',
      icon: 'users',
      to: '/accounts',
      tag: 'router-link',
    },
    {
      name: 'Address book',
      icon: 'address-book',
      to: '/addressbook',
      tag: 'router-link',
    },
    {
      name: 'Transfer',
      icon: 'paper-plane',
      to: '/transfer',
      tag: 'router-link',
    },
    {
      name: 'Democracy',
      icon: 'calendar-check',
      to: '/democracy',
      tag: 'router-link',
    },
    {
      name: 'Extrinsics',
      icon: 'sync',
      to: '/extrinsics',
      tag: 'router-link',
    },
    {
      name: 'Settings',
      icon: 'cogs',
      to: '/settings',
      tag: 'router-link',
    },
    // {
    //   name: 'Github',
    //   icon: 'code-branch',
    //   to: 'https://github.com/vue-polkadot/apps',
    //   tag: 'a',
    // },
    // {
    //   name: 'Wiki',
    //   icon: 'book',
    //   to: 'https://wiki.polkadot.network/',
    //   tag: 'a',
    // },
  ];
  public currentRow: any = this.sidebar[0];
  public isSidebarClosed = true;
  public showVerbose = false;
  public isActive = true;
  get hasBasicMode() {
    return this.$store.getters.getSettings.uiMode === 'light';
  }

  public toggleSidebar() {
    this.isSidebarClosed = !this.isSidebarClosed;
  }
}
</script>

<style>
.menu-list a {
  color: #dbdbdb;
}
.menu-list a.is-active {
  background-color: #40b883e0;
}
.happy-menu {
  background-color: #000000bd;
  min-height: 100%;
}

.menu-button {
  color: white;
}

.happy-menu.closed {
  width: 4.5rem !important;
}

.image.is-48x48.logo {
  margin-bottom: 1rem;
}

.menu-item > a > span + span {
  vertical-align: super;
  padding-left: 0.5rem;
}
.closeSideBarBtn {
  margin-top: 0.7rem;
}
.switchVerbose {
  margin-top: 0.7rem;
}
.toggleSidebar {
  bottom: 10px;
  left: 15px;
  position: absolute;
  width: 100%;
}
</style>
