<template>
    <div>
        <div v-for="step in steps">
               <TransactionStepsItem 
                    class="mb-3"
                    :step="step"
                    :active="false"
               />

               <template v-if="step.children" >
                    <TransactionStepsItem
                        v-for="childrenSteps in step.children"
                        class="mb-3"
                        :step="childrenSteps"
                        is-child
                    />
               </template>
        </div>
    </div>
</template>

<script setup lang="ts">
import { TransactionStepStatus } from "@/utils/teleport";
import TransactionStepsItem from "./TransactionStepsItem.vue"

export type TransactionStep = {
    title: string
    subtitle: string,
    status: ComputedRef<TransactionStepStatus>,
    transactionId?: ComputedRef<string>,
    children?: TransactionStep[],
}

defineProps<{
    steps: TransactionStep[]
}>()



</script>

<style scoped>

</style>