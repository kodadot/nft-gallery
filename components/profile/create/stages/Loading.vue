<template>
  <div class="h-[200px]">
    <SkeletonLoader
      :title="'setting your profile'"
      :subtitle="'please wait'"
      :with-dots="true"
      solid>
      <template #footer>
        <SkeletonLoaderFooterPill>
          No signature needed
        </SkeletonLoaderFooterPill>
      </template>
    </SkeletonLoader>
  </div>
</template>

<script setup lang="ts"></script>
