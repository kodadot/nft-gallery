<template>
  <div class="keyboard-shortcuts">
    <b-collapse
      class="card bordered"
      animation="slide"
      v-for="(collapse, index) of collapses"
      :key="index"
      :open="isOpen == index"
      @open="isOpen = index">
      <template #trigger="props">
        <div class="card-header" role="button">
          <p class="card-header-title">
            {{ collapse.title }}
          </p>
          <a class="card-header-icon">
            <b-icon :icon="props.open ? 'chevron-up' : 'chevron-down'">
            </b-icon>
          </a>
        </div>
      </template>
      <div class="card-content">
        <div class="content">
          <b-table :data="data[collapse.key]" :columns="columns"></b-table>
        </div>
      </div>
    </b-collapse>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

@Component({})
export default class keyboardShortcuts extends Vue {
  public isOpen = 0
  public collapses = [
    {
      key: 'navigation',
      title: 'Navigation',
    },
    {
      key: 'item_detail',
      title: 'Item Detail',
    },
    {
      key: 'filters',
      title: 'Filters',
    },
  ]
  public columns = [
    {
      field: 'action',
      label: 'Action',
    },
    {
      field: 'shortcut',
      label: 'Shortcut',
    },
  ]
  public data = {
    navigation: [
      {
        action: 'Go to next page on gallery/collections/collections detail',
        shortcut: 'g+n',
      },
      {
        action: 'Go to previous page on gallery/collections/collections detail',
        shortcut: 'g+p',
      },
      {
        action: 'Go to the random page at a particular view',
        shortcut: 'g+r',
      },
      {
        action: 'Go to own artist profile',
        shortcut: 'g+a',
      },
      {
        action: 'Go to your collected items',
        shortcut: 'g+c',
      },
      {
        action: 'Go to your sold items',
        shortcut: 'g+s',
      },
      {
        action: 'Go to simple mint',
        shortcut: 'g+m',
      },
      {
        action: 'Go to transfer',
        shortcut: 'g+t',
      },
      {
        action: 'Go to series insights',
        shortcut: 'g+i',
      },
      {
        action: 'Go to creators directory',
        shortcut: 'g+d',
      },
      {
        action: 'Copy current URL',
        shortcut: 'ctrl+c',
      },
    ],
    item_detail: [
      {
        action: 'Expand price chart',
        shortcut: 'e+p',
      },
      {
        action: 'Expand history chart',
        shortcut: 'e+h',
      },
      {
        action: 'Expand the description',
        shortcut: 'e+d',
      },
      {
        action: 'Buy the item',
        shortcut: 'a+b',
      },
      {
        action: 'Send the item',
        shortcut: 'a+s',
      },
      {
        action: 'Consume',
        shortcut: 'a+c',
      },
      {
        action: 'List',
        shortcut: 'a+l',
      },
    ],
    filters: [
      {
        action: 'Filter by now',
        shortcut: 'f+b',
      },
      {
        action: 'Filter new first',
        shortcut: 'f+n',
      },
      {
        action: 'Filter old first',
        shortcut: 'f+o',
      },
      {
        action: 'Filter expensive first',
        shortcut: 'f+e',
      },
      {
        action: 'Filter cheap one',
        shortcut: 'f+c',
      },
    ],
  }
}
</script>

<style lang="scss">
.keyboard-shortcuts {
  .card.bordered:not(:last-of-type) {
    border-bottom: none;
  }
}
</style>
