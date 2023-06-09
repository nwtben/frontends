<script setup lang="ts">
import {
  ChevronDownIcon
} from '@heroicons/vue/20/solid';

const props = withDefaults(
  defineProps<{
    compact?: boolean;
    value?: String;
  }>(),
  {
    compact: true,
  }
);

const emit = defineEmits(['update:value'])

const updateValue = (event: any) => {
  emit('update:value', event.target.value)
}

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
  <div 
    :class="['flex', classes || '', !props.compact && 'border border-gray-300 px-3 py-2']"
  >
    <select
      :class="{
        'appearance-none': true,
        'font-medium bg-transparent cursor-pointer focus:outline-none focus:ring-brand-light focus:border-brand-light text-sm pr-1': props.compact,
        'w-full placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:z-10 sm:text-sm': !props.compact,
      }"
      v-bind="remainingAttrs"
      :value="value"
      @change="updateValue"
    >
      <slot></slot>
    </select>
    <ChevronDownIcon class="h-5 w-5 text-current" />
  </div>
</template>