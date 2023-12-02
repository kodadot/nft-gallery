<template>
  <Story title="NeoButton" :layout="{ type: 'grid', width: '200px' }">
    <Variant title="Secondary shadow">
      <div style="height: 60px">
        <NeoButton :label="label" size="small" />
      </div>
      <div style="height: 60px">
        <NeoButton :label="label" />
      </div>
      <div style="height: 60px">
        <NeoButton :label="label" size="large" />
      </div>
    </Variant>
    <Variant title="Primary shadow">
      <div style="height: 60px">
        <NeoButton :label="label" variant="k-accent" size="small" />
      </div>
      <div style="height: 60px">
        <NeoButton :label="label" variant="k-accent" />
      </div>
      <div style="height: 60px">
        <NeoButton :label="label" variant="k-accent" size="large" />
      </div>
    </Variant>
    <Variant title="Secondary">
      <div style="height: 60px">
        <NeoButton :label="label" no-shadow size="small" />
      </div>
      <div style="height: 60px">
        <NeoButton :label="label" no-shadow />
      </div>
      <div style="height: 60px">
        <NeoButton :label="label" no-shadow size="large" />
      </div>
    </Variant>
    <Variant title="Primary">
      <div style="height: 60px">
        <NeoButton :label="label" variant="k-accent" no-shadow size="small" />
      </div>
      <div style="height: 60px">
        <NeoButton :label="label" variant="k-accent" no-shadow />
      </div>
      <div style="height: 60px">
        <NeoButton :label="label" variant="k-accent" no-shadow size="large" />
      </div>
    </Variant>
    <Variant title="Secondary rounded">
      <div style="height: 60px">
        <NeoButton :label="label" rounded no-shadow size="small" />
      </div>
      <div style="height: 60px">
        <NeoButton :label="label" rounded no-shadow />
      </div>
      <div style="height: 60px">
        <NeoButton :label="label" rounded no-shadow size="large" />
      </div>
    </Variant>
    <Variant title="Primary rounded">
      <div style="height: 60px">
        <NeoButton
          :label="label"
          variant="k-accent"
          rounded
          no-shadow
          size="small" />
      </div>
      <div style="height: 60px">
        <NeoButton :label="label" variant="k-accent" rounded no-shadow />
      </div>
      <div style="height: 60px">
        <NeoButton
          :label="label"
          variant="k-accent"
          rounded
          no-shadow
          size="large" />
      </div>
    </Variant>
    <Variant title="Outlined rounded">
      <div style="height: 60px">
        <NeoButton :label="label" rounded no-shadow size="small" />
      </div>
      <div style="height: 60px">
        <NeoButton :label="label" rounded no-shadow />
      </div>
      <div style="height: 60px">
        <NeoButton :label="label" rounded no-shadow size="large" />
      </div>
    </Variant>
  </Story>
</template>

<script lang="ts" setup>
import NeoButton from './NeoButton.vue'

const label = 'Sample'
</script>
