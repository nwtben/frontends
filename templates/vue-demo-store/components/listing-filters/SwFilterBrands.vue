<script setup lang="ts">
import { ListingFilter } from "@shopware-pwa/types";
import { inject, ref } from "vue";
import { getTranslatedProperty } from "@shopware-pwa/helpers-next";
import {
  MagnifyingGlassIcon,
} from '@heroicons/vue/24/outline';


const props = defineProps<{
  filter: ListingFilter;
}>();

const emits = defineEmits<{
  (e: "select-value", value: { code: string; value: unknown }): void;
}>();
const selectedOptionIds = inject<string[]>("selectedOptionIds");
const filter = computed(() => props.filter);

</script>

<template>
  <div class="mb-8">
    <div
      class="w-full border border-gray-300 py-2 px-3"
    >
      <div class="flex items-center">
        <MagnifyingGlassIcon
          class="flex-none h-5 w-5 cursor-pointer text-gray-700"
        />

        <input
          data-testid="layout-search-input"
          type="text"
          class="text-base text-gray-500 bg-transparent outline-none ml-2"
          :placeholder="$t('search_brands')"
        >
      </div>
    </div>
    <div class="flex flex-col my-2 max-h-[308px] overflow-y-auto">
      <div
        v-for="option in filter.options || filter.entities"
        :key="option.id"
        class="flex items-center py-3 pr-2"
      >
        <SharedCheckbox 
          :id="`filter-mobile-${filter.code}-${option.id}`"
          :modelValue="selectedOptionIds?.includes(option.id)"
          @update:modelValue="emits('select-value', { code: filter.code, value: option.id })"
          :name="filter.name"
        />
        <label :for="`filter-mobile-${filter.code}-${option.id}`" class="ml-3 text-sm font-medium text-gray-700">
          {{ getTranslatedProperty(option, "name") }}
        </label>
        <span class="ml-auto text-sm font-medium text-gray-500">10</span>
      </div>
    </div>
    <button class="text-gray-900 font-medium text-base underline">View all brands</button>
  </div>
</template>
