<script setup lang="ts">
import { ChevronLeftIcon } from "@heroicons/vue/20/solid";

const localePath = useLocalePath();

</script>

<template>
  <header
    class="z-50 relative bg-white sticky top-0 relative bg-white border-b-2 border-gray-100 text-gray-700 py-6"
  >
  <div class="container flex">
    <div class="flex-1">
      <NuxtLink class="flex gap-2 items-center" :to="localePath('/')">
        <ChevronLeftIcon class="shrink-0 h-4 w-4"/>
        <span class="text-[10px] md:text-sm uppercase font-medium text-gray-700">{{ $t('continue_method') }}</span>
      </NuxtLink>
    </div>
    <div class="flex-1 flex justify-center">
      <div>
        <NuxtLink :to="localePath('/')" class="text-current">
          <span class="sr-only">LUXED</span>
          <div :class="[
              'w-40 h-5 i-custom:logo',
            ]"
          />
        </NuxtLink>
      </div>
    </div>
    <div class="flex-1">
    </div>
  </div>
  </header>
</template>
