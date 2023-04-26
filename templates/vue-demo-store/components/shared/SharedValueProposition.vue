<script setup lang="ts">
import {
  TruckIcon,
  LockClosedIcon,
  ArrowsRightLeftIcon
} from '@heroicons/vue/24/outline';

const props = defineProps<{
  isColumn?: boolean;
}>();

const information = [
  {
    title: 'Easy shipping',
    description: `You'll receive dispatch confirmation and an arrival date`,
    icon: TruckIcon
  },
  {
    title: 'Changed your mind?',
    description: 'We offer free returns within 30 days',
    icon: ArrowsRightLeftIcon
  },
  {
    title: 'Safety',
    description: 'It carefully packaged with a personal touch',
    icon: LockClosedIcon
  }
];

</script>
<template>
  <div :class="{
    'flex gap-4': true,
    'flex-col': props.isColumn
  }">
    <div v-for="item of information" class="flex flex-1" :key="item.title">
      <component :is="item.icon" class="h-6 w-6 mr-3" />
      <div class="flex-1">
        <h6 class="text-gray-900 mb-2">{{item.title}}</h6>
        <p class="text-gray-500">{{ item.description }}</p>
      </div>
    </div>
  </div>
</template>