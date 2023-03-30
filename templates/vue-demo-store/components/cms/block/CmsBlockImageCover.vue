<script setup lang="ts">
import { CmsBlockImageCover } from "@shopware-pwa/composables-next";

const props = defineProps<{
  content: CmsBlockImageCover;
}>();

const { getSlotContent } = useCmsBlock(props.content);

const cmsContent = getSlotContent("image");
</script>
<template>
  <div class="cms-block-image-cover relative">
    <CmsGenericElement v-if="cmsContent" :content="cmsContent" />
    <div class="absolute bottom-0 left-1/2 translate -translate-x-1/2 text-white text-center" v-if="props.content.name?.toLowerCase() === 'introduction'">
      <p class="font-semibold mb-2">NEW COLLECTION</p>
      <p class="text-4xl mb-8">Shop the new <br/> Signature Collection</p>
      <button class="mb-16 bg-white border border-gray-200 text-brand-dark py-3 px-6 font-medium">Show collection</button>
    </div>
  </div>
</template>
