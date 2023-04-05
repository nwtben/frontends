<script setup lang="ts">
import { CmsBlockGalleryBuybox } from "@shopware-pwa/composables-next";

const props = defineProps<{
  content: CmsBlockGalleryBuybox;
}>();

const { getSlotContent } = useCmsBlock(props.content);
const rightContent = getSlotContent("right");
const leftContent = getSlotContent("left");
</script>

<template>
  <div
    class="flex flex-col md:flex-row justify-center"
  >
    <div class="overflow-hidden basis-1/2">
      <CmsGenericElement :content="leftContent" />
    </div>
    <div class="basis-1/2">
      <CmsGenericElement :content="rightContent" />
    </div>
  </div>
</template>
