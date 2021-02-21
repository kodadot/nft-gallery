<template>
  <div>
    <b-collapse class="card" animation="slide" 
      aria-id="contentIdForA11y3" :open="false">
      <template #trigger="props">
        <div
          class="card-header"
          role="button"
          aria-controls="contentIdForA11y3">
          <p class="card-header-title">
            {{ $t('facts') }}
          </p>
          <a class="card-header-icon">
            <b-icon
              :icon="props.open ? 'chevron-up' : 'chevron-down'">
            </b-icon>
          </a>
        </div>
      </template>

      <div class="card-content">
        <div class="content">
          <p class="subtitle is-size-6">
            <b>{{ $t('collection') }}:</b>{{ nft.collection }}
          </p>
          <p class="subtitle is-size-6">
            <b>SN:</b>{{ nft.sn }}
          </p>
          <p class="subtitle is-size-6">
            <b>{{ $t('instance') }}:</b>{{ nft.sn }}
          </p>
        </div>
      </div>
    </b-collapse>

  </div>
</template>

<script lang="ts" >
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';

@Component({})
export default class Facts extends Vue {
  @Prop() public nft!: any;
}
</script>
