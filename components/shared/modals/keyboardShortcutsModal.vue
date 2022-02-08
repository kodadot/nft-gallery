<template>
  <ModalWrapper
    icon=""
    :title="title"
    :id="'keyboardShortcutsModal'"
    :isButtonHidden="true">
    <template v-slot:default>
      <div class="is-flex is-justify-content-space-between">
        <b-table :data="data['navigation']" :columns="navColumns"></b-table>
        <b-table
          :data="data['item_detail']"
          :columns="itemDetailColumns"></b-table>
        <b-table :data="data['filters']" :columns="filterColumns"></b-table>
      </div>
    </template>
  </ModalWrapper>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

const components = {
  ModalWrapper: () => import('./ModalWrapper.vue'),
}

@Component({
  name: 'KeyboardShortcutsModal',
  components,
})
export default class KeyboardShortcutsModal extends Vue {
  public title = 'Keyboard Shortcuts'
  public navColumns = [
    {
      field: 'text',
      label: 'Navigation',
    },
    {
      field: 'shortcut',
      label: '',
    },
  ]

  public itemDetailColumns = [
    {
      field: 'text',
      label: 'Item Detail',
    },
    {
      field: 'shortcut',
      label: '',
    },
  ]

  public filterColumns = [
    {
      field: 'text',
      label: 'Filters',
    },
    {
      field: 'shortcut',
      label: '',
    },
  ]
  public data = {
    navigation: [
      {
        text: 'Next page',
        shortcut: 'g+n',
      },
      {
        text: 'Previous page',
        shortcut: 'g+p',
      },
      {
        text: 'Random page',
        shortcut: 'g+r',
      },
      {
        text: 'Profile',
        shortcut: 'g+a',
      },
      {
        text: 'Collected items',
        shortcut: 'g+c',
      },
      {
        text: 'Sold items',
        shortcut: 'g+s',
      },
      {
        text: 'Simple mint',
        shortcut: 'g+m',
      },
      {
        text: 'Transfer',
        shortcut: 'g+t',
      },
      {
        text: 'Series Insights',
        shortcut: 'g+i',
      },
      {
        text: 'Spotlight',
        shortcut: 'g+d',
      },
      {
        text: 'Copy current URL',
        shortcut: 'c+u',
      },
    ],
    item_detail: [
      {
        text: 'Expand price chart',
        shortcut: 'e+p',
      },
      {
        text: 'Expand history chart',
        shortcut: 'e+h',
      },
      {
        text: 'Expand the description',
        shortcut: 'e+d',
      },
      {
        text: 'Buy item',
        shortcut: 'a+b',
      },
      {
        text: 'Send item',
        shortcut: 'a+s',
      },
      {
        text: 'Consume item',
        shortcut: 'a+c',
      },
      {
        text: 'List item',
        shortcut: 'a+l',
      },
    ],
    filters: [
      {
        text: 'Buy now',
        shortcut: 'f+b',
      },
      {
        text: 'New first',
        shortcut: 'f+n',
      },
      {
        text: 'Old first',
        shortcut: 'f+o',
      },
      {
        text: 'Expensive first',
        shortcut: 'f+e',
      },
      {
        text: 'Cheap first',
        shortcut: 'f+c',
      },
    ],
  }
}
</script>
