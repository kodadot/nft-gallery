<template>
  <ModalWrapper
    :id="'keyboardShortcutsModal'"
    icon=""
    :title="title"
    :is-button-hidden="true">
    <template #default>
      <div class="is-flex is-justify-content-space-between">
        <NeoTable v-for="ktype in types" :key="ktype" :data="updateData[ktype]">
          <NeoTableColumn v-slot="props" field="text" :label="labels[ktype]">
            {{ props.row.text }}
          </NeoTableColumn>
          <NeoTableColumn v-slot="props" field="shortcut">
            <div>
              <span
                v-for="(shortcut, index) in props.row.shortcut.split('+')"
                :key="shortcut">
                <kbd class="keyboard-shortcut-kbd">
                  {{ shortcut }}
                </kbd>
                <span v-if="index < props.row.shortcut.split('+').length - 1">
                  +
                </span>
              </span>
            </div>
          </NeoTableColumn>
        </NeoTable>
      </div>
    </template>
    <template #hint>
      <p class="box has-text-right is-size-7">
        press <kbd type="is-primary" rounded>?</kbd> to open shortcuts menu
      </p>
    </template>
  </ModalWrapper>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import '@/styles/components/_keyboard-shortcut.scss'
import { NeoTable, NeoTableColumn } from '@kodadot1/brick'

interface DifferentTypeShortCuts {
  navigation: { text: string; shortcut: string }[]
  item_detail: { text: string; shortcut: string }[]
  filters: { text: string; shortcut: string }[]
}

interface DifferentTypeName {
  navigation: string
  item_detail: string
  filters: string
}

@Component({
  name: 'KeyboardShortcutsModal',
  components: {
    ModalWrapper: () => import('./ModalWrapper.vue'),
    NeoTable,
    NeoTableColumn,
  },
})
export default class KeyboardShortcutsModal extends Vue {
  public title = 'Keyboard Shortcuts'
  public data: DifferentTypeShortCuts = {
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
        text: this.$tc('sort.listed'),
        shortcut: 'f+b',
      },
      {
        text: this.$tc('sort.BLOCK_NUMBER_DESC'),
        shortcut: 'f+n',
      },
      {
        text: this.$tc('sort.BLOCK_NUMBER_ASC'),
        shortcut: 'f+o',
      },
    ],
  }
  public labels: DifferentTypeName = {
    navigation: 'Navigation',
    item_detail: 'Item Detail',
    filters: 'Filters',
  }
  public types = Object.keys(this.data)

  addShortcuts(shortcuts): DifferentTypeShortCuts {
    const { navigation, item_detail, filters } = this.data

    return {
      navigation,
      item_detail,
      filters: [...filters, ...shortcuts],
    }
  }

  get updateData(): DifferentTypeShortCuts {
    const routeName = this.$nuxt.$route.name

    if (routeName?.includes('collections')) {
      return this.addShortcuts([
        {
          text: this.$tc('sort.UPDATED_AT_DESC'),
          shortcut: 'f+a',
        },
        {
          text: this.$tc('sort.UPDATED_AT_ASC'),
          shortcut: 'f+e',
        },
      ])
    }

    if (routeName?.includes('gallery')) {
      return this.addShortcuts([
        {
          text: this.$tc('sort.PRICE_DESC'),
          shortcut: 'f+e',
        },
        {
          text: this.$tc('sort.PRICE_ASC'),
          shortcut: 'f+c',
        },
      ])
    }

    return this.data
  }
}
</script>
