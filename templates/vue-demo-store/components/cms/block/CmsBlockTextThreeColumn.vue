<script setup lang="ts">
import { CmsBlockTextThreeColumn } from "@shopware-pwa/composables-next";

const props = defineProps<{
  content: CmsBlockTextThreeColumn;
}>();

const { getSlotContent } = useCmsBlock(props.content);

const leftContent = getSlotContent("left");
const rightContent = getSlotContent("right");
const centerContent = getSlotContent("center");
</script>

<template>
  <article class="grid md:grid-cols-3 gap-4">
    <template v-if="props.content.name.toLowerCase() !== 'support'">
      <CmsGenericElement :content="leftContent" class="" />
      <CmsGenericElement :content="centerContent" class="" />
      <CmsGenericElement :content="rightContent" class="" />
    </template>
    <template v-else>
      <div className="flex gap-4">
        <div class="i-carbon-delivery-truck text-xl inline-block" />
        <CmsGenericElement :content="leftContent" class="" />
      </div>
      <div className="flex gap-4">
        <div class="i-carbon-arrows-horizontal text-xl inline-block" />
        <CmsGenericElement :content="centerContent" class="" />
      </div>
      <div className="flex gap-4">
        <div class="i-carbon-locked text-xl inline-block" />
        <CmsGenericElement :content="rightContent" class="" />
      </div>
    </template>
  </article>
</template>
