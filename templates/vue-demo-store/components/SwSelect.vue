<script setup lang="ts">
import {
  ChevronDownIcon
} from '@heroicons/vue/20/solid';

const attrs = useAttrs();

const classes = computed(() => attrs.class);

const remainingAttrs = computed(()=>{
  let returnObj: any = {}
  // use const below
  for (const attr in attrs) {
    if (attr !== 'class') {
      returnObj[attr] = attrs[attr]
    }
  }
  return returnObj;
});

</script>
<template>
  <div :class="['flex', classes || '']">
    <select
      class="appearance-none font-medium bg-transparent cursor-pointer focus:outline-none focus:ring-brand-light focus:border-brand-light text-sm pr-1"
      v-bind="remainingAttrs"
    >
      <slot></slot>
    </select>
    <ChevronDownIcon class="h-5 w-5 text-current" />
  </div>
</template>