
<template>
    <div class="is-flex is-flex-direction-column w-full">

        <div class="is-flex is-justify-content-space-between w-full mb-4" v-if="allowAutoTeleport">
            <div class="is-flex">
                <p class="has-text-weight-bold">{{$t('autoTeleport.autoTeleport')}}</p>
                
                <AutoTeleportTooltip :transition="optimalTransition" />
            </div>

            <NeoSwitch
                v-model="autoTeleport"
                data-testid="auto-teleport-switch" />
        </div>

        <NeoButton
          :label="autoTeleportLabel"
          variant="k-accent"
          no-shadow
          :disabled="localDisabled"
          class="is-flex is-flex-grow-1 btn-height"
          @click="submit"
        />

        <div class="is-flex is-justify-content-center mt-4" v-if="allowAutoTeleport">
            <span class="has-text-grey">Or</span> 

            <a class="ml-2" @click="rampActive = true"
            >+ {{ $t('addFunds') }} Via Onramp</a
            >
        </div>
    </div>

    <AutoTeleportModal 
        v-model="isModalOpen"
        :transition="optimalTransition"
        :can-do-action="hasEnoughInCurrentChain"
        :status="status"
        @close="isModalOpen = false"
    />

</template>

<script setup lang="ts">
import { NeoButton , NeoSwitch } from '@kodadot1/brick'
import { Actions } from '@/composables/transaction/types';

const props = defineProps<{
    amount: number,
    label: string,
    action: Actions,
}>()

const { chainSymbol , name } = useChain()
const { canTeleport, hasEnoughInCurrentChain, hasEnoughInRichestChain, optimalTransition, teleport, status, transaction } = useAutoTeleport(props.action , computed(() => props.amount))

const isModalOpen = ref(false)
const rampActive = ref(false)
const autoTeleport = ref(false)

const allowAutoTeleport = computed(() => !hasEnoughInCurrentChain.value &&  hasEnoughInRichestChain.value && optimalTransition.value.source)

const autoTeleportLabel = computed(() => {
    if (!canTeleport.value || hasEnoughInCurrentChain.value) {
        return props.label
    }

    if (hasEnoughInRichestChain.value) {
        if (autoTeleport.value) {
            return 'Teleport and confirm purchase'
        }
    }

    return `Not enough “${chainSymbol.value}” on “${name.value}”`
})

const localDisabled = computed(() => {
    if ((!hasEnoughInRichestChain.value || !autoTeleport.value) && canTeleport.value) {
        return true 
    }

    return false
})

const openAutoTeleportModal = () =>  {
    isModalOpen.value = true

    teleport({
        onSuccess:  () => {},
        onError: () => {
            isModalOpen.value = false
        }
    })
}

const submit = () => {
    if (canTeleport.value) {
        openAutoTeleportModal() 
    } else {
        transaction()
    }
}


</script>

<style scoped>

</style>