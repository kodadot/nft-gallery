<template>
  <div class="columns">
    <div class="column">
      <NominateInput label="Candidate accounts" :options="candidates" @input="selectCandidates" />
    </div>
    <div class="column is-1">
      <b-button icon-left="plus" @click="handleAdd" :disabled="disabledAdd" />
      <b-button icon-left="minus" @click="handleRemove" :disabled="disabledRemove" />
    </div>
    <div class="column">
      <NominateInput label="Nominated accounts" :options="nominated" @input="selectNominated" />
    </div>
  </div>
</template>
<script lang="ts" >
import { Component, Prop, Vue, Watch, Emit } from 'vue-property-decorator';
import NominateInput from './NominateInput.vue';

const components = {
  NominateInput
};

@Component({ components })
export default class NominatePartial extends Vue {
  @Prop() private targetValidatorIds!: string[];
  @Prop() public readonly nominating!: string[];
  
  private candidates: string[] = [];
  private nominated: string[] = [];

  private _selectedCandidates: string[] = [];
  private _selectedNominated: string[] = [];

  public mounted() {
    
    if (this.targetValidatorIds) {
      console.log('[DEBUG] targetValidatorIds', this.targetValidatorIds, this.candidates);
      this.candidates = [...this.targetValidatorIds];
      console.log('[AFTER] ', this.candidates);

    }

    if (this.nominated) {
      this.nominated = [...this.nominating];
    }
  }


  private handleAdd() {
    this.nominated = [...this.nominated, ...this._selectedCandidates];
    this.candidates = this.candidates.filter(candidate => !this._selectedCandidates.includes(candidate))
    this._selectedCandidates = [];
    this.$emit('input', this.nominated)
  }

  private handleRemove() {
    this.candidates = [...this.candidates, ...this._selectedNominated];
    this.nominated = this.nominated.filter(nominate => !this._selectedNominated.includes(nominate))
    this._selectedNominated = [];
    this.$emit('input', this.nominated)
  }


  private selectCandidates(_candidates: string[]) {
    this._selectedCandidates = [..._candidates];
  }

  private selectNominated(_nominated: string[]) {
    this._selectedNominated = [..._nominated];
  }

  get disabledAdd() {
    return this._selectedCandidates && this._selectedCandidates.length
  }

  get disabledRemove() {
    return this._selectedNominated && this._selectedNominated.length
  }

}
</script>
