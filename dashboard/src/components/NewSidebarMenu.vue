<template>
  <b-sidebar :mobile="mobileView" position="fixed" :reduce="reduce" type="is-light" open fullheight>
    <div class="p-1">
      <div class="block">
        <img
          src="../assets/koda_logo_843x843.png"
          alt="KodaDot logo"
        />
      </div>
      <b-menu class="is-custom-mobile">
        <b-menu-list label="Apps" icon-pack="fa">
          <b-menu-item
            class="sidebar-menu__item"
            v-for="row in sidebar"
            v-bind:key="row.name"
            @click="currentRow = row"
            :icon="row.icon"
            :label="row.name"
            :tag="row.tag"
            :to="row.to"
          ></b-menu-item>

          <b-menu-list label="Links" icon-pack="fa">
            <b-menu-item
              v-for="row in externalLinks"
              v-bind:key="row.name"
              @click="currentRow = row"
              :icon="row.icon"
              :icon-pack="row.pack"
              :label="row.name"
              :href="row.href"
              :target="row.target"
            ></b-menu-item>
          </b-menu-list>
        </b-menu-list>
      </b-menu>
      <b-button :icon-left="toggleIcon" 
        @click="toggleSidebar" rounded>
      </b-button>
    </div>
  </b-sidebar>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit } from 'vue-property-decorator';
import SettingInfo from '@/components/shared/SettingInfo.vue';
import NetworkVisualCue from '@/components/explorer/NetworkVisualCue.vue';

@Component({
  components: {
    SettingInfo,
    NetworkVisualCue,
  },
})
export default class SidebarMenu extends Vue {
  public reduce = true;
  public sidebar: any = [
    {
      name: 'Explorer',
      icon: 'search',
      to: { name: 'explorer' },
      tag: 'router-link',
    },
    {
      name: 'Accounts',
      icon: 'users',
      to: { name: 'accounts' },
      tag: 'router-link',
    },
    {
      name: 'Address book',
      icon: 'address-book',
      to: { name: 'addressbook' },
      tag: 'router-link',
    },
    {
      name: 'Transfer',
      icon: 'paper-plane',
      to: { name: 'transfer' },
      tag: 'router-link',
    },
    {
      name: 'Democracy',
      icon: 'calendar-check',
      to: { name: 'democracy' },
      tag: 'router-link',
    },
    {
      name: 'Extrinsics',
      icon: 'sync',
      to: { name: 'extrinsics' },
      tag: 'router-link',
    },
    {
      name: 'Settings',
      icon: 'cogs',
      to: { name: 'settings' },
      tag: 'router-link',
    },
  ];
  public externalLinks: any = [
    {
      name: 'Github',
      icon: 'code-branch',
      href: 'https://github.com/vue-polkadot/apps',
      target: '_blank'
    },
    {
      name: 'Wiki',
      icon: 'book',
      href: 'https://wiki.polkadot.network/',
      target: '_blank'
    },
    {
      name: '@KodaDot',
      icon: 'twitter',
      pack: 'fab',
      href: 'https://twitter.com/KodaDot',
      target: '_blank'
    },
  ];
  public currentRow: any = this.sidebar[0];
  public isSidebarClosed = true;
  public showVerbose = false;
  public isActive = true;
  get hasBasicMode() {
    return this.$store.getters.getSettings.uiMode === 'light';
  }

  @Emit('toggle')
  public toggleSidebar() {
    this.reduce = !this.reduce;
    return this.reduce;
  }

  get toggleIcon() {
    return this.reduce ? 'angle-double-right' : 'angle-double-left'
  }

  get mobileView() {
    return this.reduce ? 'reduce' : ''
  }

}
</script>

<style lang="scss">
.menu-list a.router-link-active {
  background-color: #7957d5;
  color: white;
  // background-color: #40b883e0;
}

.menu-list li.sidebar-menu__item a:not(.router-link-active):hover {
  background-color: #dbdbdb;
}

.p-1 {
  padding: 1em;
}
.sidebar-page {
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 100%;
  .sidebar-layout {
    display: flex;
    flex-direction: row;
    min-height: 100%;
  }
}
@media screen and (max-width: 1023px) {
  .b-sidebar {
    .sidebar-content {
      &.is-mini-mobile {
        &:not(.is-mini-expand),
        &.is-mini-expand:not(:hover) {
          .menu-list {
            li {
              a {
                span:nth-child(2) {
                  display: none;
                }
              }
              ul {
                padding-left: 0;
                li {
                  a {
                    display: inline-block;
                  }
                }
              }
            }
          }
          .menu-label:not(:last-child) {
            margin-bottom: 0;
          }
        }
      }
    }
  }
}
@media screen and (min-width: 1024px) {
  .b-sidebar {
    .sidebar-content {
      &.is-mini {
        &:not(.is-mini-expand),
        &.is-mini-expand:not(:hover) {
          .menu-list {
            li {
              a {
                span:nth-child(2) {
                  display: none;
                }
              }
              ul {
                padding-left: 0;
                li {
                  a {
                    display: inline-block;
                  }
                }
              }
            }
          }
          .menu-label:not(:last-child) {
            margin-bottom: 0;
          }
        }
      }
    }
  }
}
</style>
