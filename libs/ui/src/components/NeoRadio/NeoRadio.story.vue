<template>
  <Story title="NeoRadio">
    <Variant title="NeoRadio Base">
      <section>
        <div class="block">
          <NeoRadio v-model="radio" name="name" native-value="Flint">
            Flint
          </NeoRadio>
          <NeoRadio v-model="radio" name="name" native-value="Silver">
            Silver
          </NeoRadio>
          <NeoRadio v-model="radio" name="name" native-value="Jack">
            Jack
          </NeoRadio>
          <NeoRadio v-model="radio" name="name" native-value="Vane" disabled>
            Vane
          </NeoRadio>
        </div>
        <p class="content">
          <b>Selection:</b>
          {{ radio }}
        </p>
      </section>
    </Variant>

    <Variant title="NeoRadio Variant">
      <section>
        <div class="field">
          <NeoRadio v-model="radioVariant" native-value="default">
            Default
          </NeoRadio>
        </div>
        <div class="field">
          <NeoRadio v-model="radioVariant" native-value="info" variant="info">
            Info
          </NeoRadio>
        </div>
        <div class="field">
          <NeoRadio
            v-model="radioVariant"
            native-value="success"
            variant="success">
            Success
          </NeoRadio>
        </div>
        <div class="field">
          <NeoRadio
            v-model="radioVariant"
            native-value="danger"
            variant="danger">
            Danger
          </NeoRadio>
        </div>
        <div class="field">
          <NeoRadio
            v-model="radioVariant"
            native-value="warning"
            variant="warning">
            Warning
          </NeoRadio>
        </div>
      </section>
    </Variant>

    <Variant title="NeoRadioButton">
      <NeoField>
        <NeoRadioButton
          v-model="radioButton"
          native-value="Nope"
          type="is-danger is-light is-outlined">
          <span>Nope</span>
        </NeoRadioButton>

        <NeoRadioButton
          v-model="radioButton"
          native-value="Yep"
          type="is-success is-light is-outlined">
          <span>Yep</span>
        </NeoRadioButton>

        <NeoRadioButton
          v-model="radioButton"
          native-value="Default"
          type="is-primary is-light is-outlined">
          Default
        </NeoRadioButton>

        <NeoRadioButton v-model="radioButton" native-value="Disabled" disabled>
          Disabled
        </NeoRadioButton>
      </NeoField>

      <p class="content">
        <b>Selection:</b>
        {{ radioButton }}
      </p>
    </Variant>
  </Story>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import NeoField from './NeoField.vue'
import NeoRadio from './NeoRadio.vue'
import NeoRadioButton from './NeoRadioButton.vue'

const radioButton = ref('')
const radio = ref('Jack')
const radioVariant = ref('default')
</script>
