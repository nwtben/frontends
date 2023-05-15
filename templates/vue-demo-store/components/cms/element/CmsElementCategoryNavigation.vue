<script setup lang="ts">
import { ClientApiError } from "@shopware-pwa/types";
import {
  getTranslatedProperty,
} from "@shopware-pwa/helpers-next";
const { category: activeCategory } = useCategory();
const { navigationElements, loadNavigationElements } = useNavigation({
  type: activeCategory.value.id as any
});

onMounted(async () => {
  try {
    await loadNavigationElements({ depth: 2 });
  } catch (e) {
    const err = e as ClientApiError;
    console.error("[SwBottomMenu]", err.messages);
  }
});

</script>
<template>
  <div>
    <h3 class="mt-8 md:mt-10 mb-2 md:mb-4 text-black md:text-gray-900">
      {{ getTranslatedProperty(activeCategory, 'name') }}
    </h3>
    <p class="text-gray-700 mb-4 max-w-[590px]" v-html="getTranslatedProperty(activeCategory, 'description')" />

    <div class="flex items-center overflow-x-auto gap-2 pb-6 border-b border-b-gray-200">
      <div v-for="subCategory of navigationElements" class="font-medium py-2 px-5 text-white bg-gray-800 hover:bg-brand-dark hover:cursor-pointer">
        {{ getTranslatedProperty(subCategory, 'name') }}
      </div>
    </div>
  </div>
</template>
