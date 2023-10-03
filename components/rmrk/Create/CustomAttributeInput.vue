<template>
  <CollapseWrapper :visible="visible" :hidden="hidden">
    <div
      v-for="(attribute, index) in attributes"
      :key="index"
      class="custom-attribute-input my-4">
      <AttributeInput
        v-bind.sync="attributes[index]"
        :index="index"
        @remove="removeAttribute" />
    </div>
    <NeoButton
      no-shadow
      class="my-4"
      :disabled="disabled"
      icon-left="plus"
      @click.native="addAttribute">
      Add Attribute
    </NeoButton>
  </CollapseWrapper>
</template>

<script lang="ts" setup>
import { Attribute } from '@kodadot1/minimark/common'
import { NeoButton } from '@kodadot1/brick'
import AttributeInput from './AttributeInput.vue'

const props = withDefaults(
  defineProps<{
    max: number
    visible?: string
    hidden?: string
  }>(),
  {
    max: 0,
    visible: 'collapse.collection.attributes.show',
    hidden: 'collapse.collection.attributes.hide',
  }
)

const emit = defineEmits(['input'])
const attributes = ref([])
const disabled = computed(
  () => props.max > 0 && attributes.value.length === props.max
)

const addAttribute = () => {
  if (!props.max || attributes.value.length < props.max) {
    attributes.value.push({
      value: '',
      trait_type: '',
    })
  }
}
const removeAttribute = (index: number) => attributes.value.splice(index, 1)
const handleInput = (attributes: Attribute[]) => emit('input', attributes)

watch(attributes.value, () => {
  handleInput(attributes.value)
})
</script>

<style scoped>
.attribute-label {
  font-size: calc(1rem * 0.75);
}

.collapse-icon {
  vertical-align: sub;
}
</style>
