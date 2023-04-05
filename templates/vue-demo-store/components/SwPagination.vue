<script setup lang="ts">
import {
  ArrowLeftIcon,
  ArrowRightIcon,
} from '@heroicons/vue/24/outline';
</script>
<template>
  <nav class="isolate inline-flex -space-x-px" aria-label="Pagination">
    <a href="#" class="relative inline-flex items-center px-2 py-2 text-gray-400 focus:z-20 focus:outline-offset-0">
      <span class="sr-only">Previous</span>
      <ArrowLeftIcon class="h-5 w-5 text-gray-500" aria-hidden="true" />
    </a>
    <a href="#" aria-current="page" class="relative z-10 inline-flex items-center px-4 py-2.25 text-sm font-medium text-gray-900 focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2">1</a>
    <a href="#" class="relative inline-flex items-center px-4 py-2.25 text-sm font-medium text-gray-500 focus:z-20 focus:outline-offset-0">2</a>
    <a href="#" class="relative inline-flex items-center px-4 py-2.25 text-sm font-medium text-gray-500 focus:z-20 focus:outline-offset-0">3</a>
    <span class="relative inline-flex items-center px-4 py-2.25 text-sm font-semibold text-gray-700 focus:outline-offset-0">...</span>
    <a href="#" class="relative inline-flex items-center px-4 py-2.25 text-sm font-medium text-gray-500 focus:z-20 focus:outline-offset-0">10</a>
    <a href="#" class="relative inline-flex items-center px-2 py-2 text-gray-400 focus:z-20 focus:outline-offset-0">
      <span class="sr-only">Next</span>
      <ArrowRightIcon class="h-5 w-5 text-gray-500" aria-hidden="true" />
    </a>
  </nav>
</template>