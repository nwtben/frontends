<script setup lang="ts">
import { OrderLineItem, LineItem } from '@shopware-pwa/types';

const props = defineProps<{
  lineItems: OrderLineItem[] | LineItem[];
  enableActions?: boolean;
}>();
</script>
<template>
  <ul>
    <template v-for="lineItem of props?.lineItems">
      <SharedProductOrder :lineItem="lineItem" :enableActions="props.enableActions"/>
    </template>
  </ul>
</template>