<script setup lang="ts">
import { CmsBlockTextThreeColumn } from "@shopware-pwa/composables-next";
import {
  TruckIcon,
  LockClosedIcon,
  ArrowsRightLeftIcon
} from '@heroicons/vue/24/outline';
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
      <div class="flex">
        <TruckIcon class="h-7 w-7 mr-4" />
        <CmsGenericElement :content="leftContent" class="flex-1" />
      </div>
      <div class="flex">
        <ArrowsRightLeftIcon class="h-7 w-7 mr-4" />
        <CmsGenericElement :content="centerContent" class="flex-1" />
      </div>
      <div class="flex">
        <LockClosedIcon class="h-7 w-7 mr-4" />
        <CmsGenericElement :content="rightContent" class="flex-1" />
      </div>
    </template>
  </article>
</template>
