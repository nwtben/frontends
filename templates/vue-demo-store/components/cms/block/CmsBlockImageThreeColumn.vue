<script setup lang="ts">
import { CmsBlockImageThreeColumn } from "@shopware-pwa/composables-next";

const props = defineProps<{
  content: CmsBlockImageThreeColumn;
}>();

const { getSlotContent } = useCmsBlock(props.content);

const leftContent = getSlotContent("left");
const rightContent = getSlotContent("right");
const centerContent = getSlotContent("center");

const { navigationElements } = useNavigation();
</script>
<template>
  <div class="grid md:grid-cols-3 gap-10">
    <template v-if="props.content?.name?.toLowerCase() !== 'categories'">
      <CmsGenericElement :content="leftContent" />
      <CmsGenericElement :content="centerContent" />
      <CmsGenericElement :content="rightContent" />
    </template>
    <template v-else>
      <div class="relative">
        <CmsGenericElement class="h-full" :content="leftContent" />
        <div class="bg-gradient-to-t from-gray-600 w-full text-center absolute bottom-0 left-1/2 translate -translate-x-1/2">
          <p class="pt-5 font-medium text-xl text-white mb-4">{{ navigationElements?.[0].name }}</p>
          <button class="bg-white border border-gray-200 text-brand-dark py-2 px-4 font-medium mb-6">Shop now</button>
        </div>
      </div>
      <div class="relative">
        <CmsGenericElement :content="centerContent" />
        <div class="bg-gradient-to-t from-gray-600 w-full text-center absolute bottom-0 left-1/2 translate -translate-x-1/2">
          <p class="pt-5 font-medium text-xl text-white mb-4">{{ navigationElements?.[1].name }}</p>
          <button class="bg-white border border-gray-200 text-brand-dark py-2 px-4 font-medium mb-6">Shop now</button>
        </div>
      </div>
      <div class="relative">
        <CmsGenericElement :content="rightContent" />
        <div class="bg-gradient-to-t from-gray-600 w-full text-center absolute bottom-0 left-1/2 translate -translate-x-1/2">
          <p class="pt-5 font-medium text-xl text-white mb-4">{{ navigationElements?.[2].name }}</p>
          <button class="bg-white border border-gray-200 text-brand-dark py-2 px-4 font-medium mb-6">Shop now</button>
        </div>
      </div>
    </template>
  </div>
</template>
