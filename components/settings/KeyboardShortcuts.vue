<template>
  <div class="keyboard-shortcuts">
    <b-collapse
      v-for="(collapse, index) of collapses"
      :key="index"
      class="card bordered"
      animation="slide"
      :open="isOpen == index"
      @open="isOpen = index">
      <template #trigger="props">
        <div class="card-header" role="button">
          <p class="card-header-title">
            {{ collapse.title }}
          </p>
          <a class="card-header-icon">
            <NeoIcon :icon="props.open ? 'chevron-up' : 'chevron-down'" />
          </a>
        </div>
      </template>
      <div class="card-content">
        <div class="content">
          <b-table :data="data[collapse.key]">
            <b-table-column v-slot="props" field="shortcut" label="Shortcut">
              <div>
                <span
                  v-for="(shortcut, idx) in props.row.shortcut.split('+')"
                  :key="shortcut">
                  <kbd class="keyboard-shortcut-kbd">
                    {{ shortcut }}
                  </kbd>
                  <span v-if="idx < props.row.shortcut.split('+').length - 1">
                    +
                  </span>
                </span>
              </div>
            </b-table-column>
            <b-table-column v-slot="props" field="action" label="Action">
              {{ props.row.action }}
            </b-table-column>
          </b-table>
        </div>
      </div>
    </b-collapse>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import '@/styles/components/_keyboard-shortcut.scss'
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
        shortcut: 'c+u',
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
        action: 'Filter buy now',
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
