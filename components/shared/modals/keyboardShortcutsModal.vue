<template>
  <ModalWrapper
    icon=""
    :title="title"
    :id="'keyboardShortcutsModal'"
    :isButtonHidden="true">
    <template v-slot:default>
      <div class="is-flex is-justify-content-space-between">
        <b-table :data="data[type]" v-for="type in types" :key="type">
          <b-table-column field="text" :label="labels[type]" v-slot="props">
            {{ props.row.text }}
          </b-table-column>
          <b-table-column field="shortcut" v-slot="props">
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
          </b-table-column>
        </b-table>
      </div>
    </template>
    <template #hint>
      <p class="box has-text-right is-size-7">
        press <b-tag type="is-primary" rounded>?</b-tag> to open shortcuts menu
      </p>
    </template>
  </ModalWrapper>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import '@/styles/keyboard-shortcut.scss'
const components = {
  ModalWrapper: () => import('./ModalWrapper.vue'),
}

interface DifferentTypeShortCuts {
  navigation: string | { text: string; shortcut: string }[]
  item_detail: string | { text: string; shortcut: string }[]
  filters: string | { text: string; shortcut: string }[]
}

@Component({
  name: 'KeyboardShortcutsModal',
  components,
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
  public labels: DifferentTypeShortCuts = {
    navigation: 'Navigation',
    item_detail: 'Item Detail',
    filters: 'Filters',
  }
  public types = Object.keys(this.data)
}
</script>
