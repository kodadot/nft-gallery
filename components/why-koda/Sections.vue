<template>
  <section>
    <div :class="containerClasses">
      <div
        v-for="section in mainSections"
        :id="section.id"
        :key="section.id"
        class="py-14 md:py-[5.5rem] border-k-shade2"
        :class="{
          'border-b': section.id !== 'onboarding',
          '!pb-0': section.id === 'onboarding',
        }">
        <WhyKodaSectionItem :section="section" />
      </div>
    </div>

    <div>
      <div class="flex gap-4 py-20 justify-center">
        <div
          v-for="img in offlineExhibitionsImages"
          :key="img"
          class="h-[358px] min-w-[480px] shadow-primary border rounded-xl overflow-hidden">
          <BasicImage :src="img" alt="offline_exhibitions" />
        </div>
      </div>

      <div :class="containerClasses">
        <div class="pb-20">
          <p class="text-xl md:text-2xl">{{ $t('benefits') }}:</p>
          <div class="flex gap-4 flex-wrap !mt-4">
            <div v-for="benefit in offlineExhibitionsBenefits" :key="benefit">
              <span class="border rounded-full px-2 text-xl md:text-2xl">
                {{ $t(`whyKoda.benefits.${benefit}`) }}
              </span>
            </div>
          </div>
        </div>

        <div
          v-if="lastSection"
          class="py-14 md:py-[5.5rem] border-k-shade2 border-t">
          <WhyKodaSectionItem :section="lastSection" />
        </div>
      </div>
    </div>
  </section>
</template>
<script lang="ts" setup>
const containerClasses = 'container mx-auto max-md:px-4'

const props = defineProps<{
  sections: { name: string; id: string; description: string; number: number }[]
}>()

const glob = import.meta.glob('~/public/why-koda-*.webp', { eager: true })

const offlineExhibitionsImages = Object.entries(glob).map(
  ([, value]) => value.default,
)

const mainSections = computed(() =>
  props.sections.slice(0, props.sections.length - 1),
)

const lastSection = computed(() => props.sections[props.sections.length - 1])

const offlineExhibitionsBenefits = [
  'visibility_recognition',
  'digital_creations_to_physical_audience',
  'increased_sales',
  'artist_growth',
  'new_space_for_collaborations',
]
</script>
