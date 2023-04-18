<script setup lang="ts">
import { CmsBlockTextThreeColumn } from "@shopware-pwa/composables-next";
import SharedValueProposition from '../../shared/SharedValueProposition.vue';

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
    <template v-if="props.content.name?.toLowerCase() === 'value-proposition'">
      <SharedValueProposition />
    </template>
    <template v-else>
      <CmsGenericElement :content="leftContent" class="" />
      <CmsGenericElement :content="centerContent" class="" />
      <CmsGenericElement :content="rightContent" class="" />
    </template>
  </article>
</template>
