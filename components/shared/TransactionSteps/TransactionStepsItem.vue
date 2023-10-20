<template>
    <div class="is-flex">

        <div class="divider mr-6 ml-3" v-if="isChild" />


        <div class="mr-4">

            <NeoIcon
                v-if="isLoading"
                icon="spinner-third" 
                size="large"
            />

            <NeoIcon
                v-else-if="isCompleted"
                class="has-text-k-green"
                icon="check" 
                size="large"
            />

            <NeoIcon 
                v-else-if="isWaiting"
                class="has-text-k-grey"
                icon="circle" 
                size="large"
            />

            <NeoIcon 
                v-else-if="isFailed"
                class="has-text-k-red"
                icon="xmark" 
                size="large"
            />


        </div>

        <div class="is-flex is-align-items-center">
            <div class="is-flex is-flex-direction-column">
                <p
            class="is-capitalized"
                :class="{'has-text-weight-bold': !isChild}"
            >{{ step.title }}</p>
            <p class="is-capitalized"> {{ step.subtitle }}</p>
            </div>
            <div class="is-flex ml-4" v-if="isCompleted && step.txId" >
                <nuxt-link class="has-text-link">View Tx</nuxt-link>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { NeoIcon } from "@kodadot1/brick"
import {TransactionStepStatus} from "@/utils/teleport"

export type TransactionStepItem = {
    txId: string| null
    error: string | null
    status: TransactionStepStatus
    title: string
    subtitle?: string
    withAction?: boolean
}

const props = defineProps<{
    step: TransactionStepItem,
    isChild?: boolean
    withAction?: boolean
}>()

const status = computed(() => props.step.status)

const isLoading = computed(() => status.value === 'loading')
const isCompleted = computed(() => status.value === 'completed')
const isWaiting = computed(() => status.value === 'waiting')
const isFailed = computed(() => status.value === 'failed')
</script>


<style scoped lang="scss">

.divider {
  width: 1px;
  min-height: 100%;
  background-color: #CCCCCC;
}

</style>