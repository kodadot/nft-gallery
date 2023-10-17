
<template>
    <div class="is-flex is-flex-direction-column w-full">

        <div class="is-flex is-justify-content-space-between w-full mb-4" v-if="showTeleport">
            <p class="has-text-weight-bold">Auto Teleport</p>

            <NeoSwitch
                v-model="autoTeleport"
                data-testid="auto-teleport-switch" />
        </div>

        <NeoButton
          :label="label"
          variant="k-accent"
          no-shadow
          :disabled="false"
          class="is-flex is-flex-grow-1 btn-height"
        />

        <div class="is-flex is-justify-content-center mt-4" v-if="showTeleport">
            <span class="has-text-grey">Or</span> 

            <a class="ml-2" @click="rampActive = true"
            >+ {{ $t('addFunds') }} Via Onramp</a
            >
        </div>
        
    </div>
</template>

<script setup lang="ts">
import { NeoButton , NeoSwitch } from '@kodadot1/brick'


const props = defineProps<{
    amount: number,
    label: string
}>()

const autoTeleport = ref(false)
const { hasEnough, hasEnoughInOtherChains} = useAutoTeleport(computed(() => props.amount))
const showTeleport = computed(() => !hasEnough.value)

</script>

<style scoped>

</style>