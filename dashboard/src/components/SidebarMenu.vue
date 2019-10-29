<template>
  <div
    class="column happy-menu is-one-fifth is-one-third-mobile is-one-fifth-tablet"
    v-bind:class="{closed: isSidebarClosed }"
  >
    <figure class="image is-48x48 logo" @click="toggleSidebar">
      <img
        class="is-rounded"
        src="../assets/vue-polkadot.png"
        alt="Lightweight UI components for Vue.js based on Bulma"
      />
    </figure>
    <b-menu>
      <b-menu-list v-if="!isSidebarClosed">
        <b-menu-item
          class="menu-item"
          v-for="row in sidebar"
          v-bind:key="row.name"
          @click="currentRow = row"
          :icon="row.icon"
          :label="row.name"
          :tag="row.tag"
          :to="row.to"
          :disabled="row.disabled"
        ></b-menu-item>
      </b-menu-list>
      <b-menu-list v-if="isSidebarClosed">
        <b-menu-item
          v-for="row in sidebar"
          v-bind:key="row.name"
          @click="currentRow = row"
          :icon="row.icon"
          :tag="row.tag"
          :to="row.to"
          :disabled="row.disabled"
        ></b-menu-item>
      </b-menu-list>
    </b-menu>
    <b-button v-if="!isSidebarClosed" icon-left="angle-double-left" @click="toggleSidebar" rounded></b-button>
    <b-button v-if="isSidebarClosed" icon-left="angle-double-right" @click="toggleSidebar" rounded></b-button>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component({})
export default class SidebarMenu extends Vue {
  public sidebar: any = [
    {
      name: "accounts",
      icon: "users",
      to: "/accounts",
      tag: "router-link"
    },
    {
      name: "address book",
      icon: "address-book",
      to: "/addressbook",
      tag: "router-link"
    },
    {
      name: "transfer",
      icon: "paper-plane",
      to: "/transfer",
      tag: "router-link"
    },
    {
      name: "explorer",
      icon: "dice-d20",
      to: "/explorer",
      tag: "router-link"
    },
    {
      name: "democracy",
      icon: "calendar-check",
      to: "/democracy",
      tag: "router-link"
    },
    {
      name: "extrinsics",
      icon: "sync",
      to: "/extrinsics",
      tag: "router-link"
    },
    {
      name: "settings",
      icon: "cogs",
      to: "/settings",
      tag: "router-link"
    }
  ];
  public currentRow: any = this.sidebar[0];
  public isSidebarClosed = false;

  get hasBasicMode() {
    return this.$store.getters.getSettings.uiMode === "light";
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
}
</style>
