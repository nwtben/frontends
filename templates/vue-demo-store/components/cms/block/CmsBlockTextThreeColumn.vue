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
    <template v-if="props.content.name?.toLowerCase() !== 'support'">
      <CmsGenericElement :content="leftContent" class="" />
      <CmsGenericElement :content="centerContent" class="" />
      <CmsGenericElement :content="rightContent" class="" />
    </template>
    <template v-else>
      <div class="flex gap-4">
        <div class="i-carbon-delivery-truck text-2xl inline-block" />
        <CmsGenericElement :content="leftContent" class="" />
      </div>
      <div class="flex gap-4">
        <div class="i-carbon-arrows-horizontal text-2xl inline-block" />
        <CmsGenericElement :content="centerContent" class="" />
      </div>
      <div class="flex gap-4">
        <div class="i-carbon-locked text-2xl inline-block" />
        <CmsGenericElement :content="rightContent" class="" />
      </div>
    </template>
  </article>
</template>
