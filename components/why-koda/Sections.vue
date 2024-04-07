<template>
  <section class="container mx-auto max-md:px-4">
    <div
      v-for="section in sections"
      :id="section.id"
      :key="section.id"
      class="py-14 md:py-[5.5rem] border-k-shade2"
      :class="{ 'border-b': section.id !== 'onboarding' }">
      <WhyKodaSectionItem :section="section">
        <div v-if="section.id === 'offline_exhibitions'" class="relative">
          <div class="flex gap-4 py-20">
            <div
              v-for="img in offlineExhibitionsImages"
              :key="img"
              class="h-[358px] min-w-[480px] shadow-primary border rounded-xl overflow-hidden">
              <BasicImage :src="img" alt="offline_exhibitions" />
            </div>
          </div>

          <div>
            <p class="text-xl md:text-2xl">{{ $t('benefits') }}:</p>
            <div class="flex gap-4 flex-wrap !mt-4">
              <div v-for="benefit in benefits" :key="benefit">
                <span class="border rounded-full px-2 text-xl md:text-2xl">
                  {{ $t(`whyKoda.benefits.${benefit}`) }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </WhyKodaSectionItem>
    </div>
  </section>
</template>
<script lang="ts" setup>
defineProps<{
  sections: { name: string; id: string; description: string; number: number }[]
}>()

const glob = import.meta.glob('~/public/why-koda-*.jpeg', { eager: true })

const offlineExhibitionsImages = Object.entries(glob).map(
  ([, value]) => value.default,
)

const benefits = [
  'visibility_recognition',
  'digital_creations_to_physical_audience',
  'increased_sales',
  'artist_growth',
  'new_space_for_collaborations',
]
</script>
