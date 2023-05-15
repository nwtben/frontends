<script setup lang="ts">
import { OrderLineItem, LineItem } from '@shopware-pwa/types';

const props = defineProps<{
  lineItems: OrderLineItem[] | LineItem[];
  enableActions?: boolean;
  isContainer?: boolean;
  isMiniCart?: boolean;
}>();
</script>
<template>
  <ul :class="{
    'flex flex-col gap-6 md:gap-10': true,
    '!gap-0': props.isMiniCart
  }">
    <template v-for="lineItem of props?.lineItems">
      <SharedProductOrder :class="{
        'py-6 px-4 md:p-8': props.isContainer,
        '!py-6': props.isMiniCart,
      }" :lineItem="lineItem" :enableActions="props.enableActions"/>
    </template>
  </ul>
</template>