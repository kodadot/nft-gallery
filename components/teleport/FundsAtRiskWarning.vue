<template>
  <div class="has-text-danger is-flex is-align-items-center cursor-default">
    <NeoIcon
      icon="triangle-exclamation"
      pack="fasr"
      class="mr-3"
      size="medium" />
    <span>{{ $t('teleport.fundsAtRisk') }} -&nbsp;</span>
    <NeoTooltip
      multiline
      :multiline-width="256"
      :auto-close="['outside', 'inside']">
      <u>{{ $t('teleport.why') }}</u>
      <template #content>
        <div class="text-left py-2 is-flex is-flex-direction-column">
          <span class="mb-3">
            {{
              reason === 'source'
                ? $t('teleport.sourceExistentialDepositWarning', [
                    sourceExistentialDeposit,
                  ])
                : $t('teleport.targetExistentialDepositWarning', [
                    targetExistentialDeposit,
                  ])
            }}
            <b>{{ $t('teleport.lossOfFunds') }}</b>
          </span>
          <a
            v-safe-href="
              'https://hello.kodadot.xyz/multi-chain/existential-deposit'
            "
            target="_blank"
            class="has-text-k-blue">
            {{ $t('teleport.whatIsExistentialDeposit') }}
          </a>
        </div>
      </template>
    </NeoTooltip>
  </div>
</template>

<script setup lang="ts">
import { NeoIcon, NeoTooltip } from '@kodadot1/brick'
defineProps<{
  targetExistentialDeposit: number | string
  sourceExistentialDeposit: number | string
  reason: 'source' | 'target'
}>()
</script>
