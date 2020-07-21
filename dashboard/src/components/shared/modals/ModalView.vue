<template>

    <b-modal :active=true :can-cancel=false>
      <div class="card">
        <header class="card-header">
        </header>
        <div class="card-content">
          <slot></slot>
        </div>
      </div>
    </b-modal>
  
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';

@Component
export default class ModalView extends Vue {

  


}
</script>
