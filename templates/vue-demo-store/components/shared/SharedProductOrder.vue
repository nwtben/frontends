<script setup lang="ts">
import { OrderLineItem, LineItem } from '@shopware-pwa/types';
import { getSmallestThumbnailUrl } from "@shopware-pwa/helpers-next";
import SwQuantitySelector from '../SwQuantitySelector.vue';
import {
  TrashIcon,
} from '@heroicons/vue/24/outline';

const props = defineProps<{
  lineItem: OrderLineItem | LineItem;
  enableActions?: boolean;
}>();

const { lineItem } = toRefs(props);

const isLoading = ref(false);

const {
  itemOptions,
  removeItem,
  itemRegularPrice,
  itemQuantity,
  isPromotion,
  itemStock,
  changeItemQuantity,
} = useCartItem(lineItem as any);

const quantity = ref();
syncRefs(itemQuantity, quantity);

const updateQuantity = async (quantity: number | undefined) => {
  if (quantity === itemQuantity.value) return;

  isLoading.value = true;

  await changeItemQuantity(Number(quantity));

  isLoading.value = false;
};
const debounceUpdate = useDebounceFn(updateQuantity, 800);

watch(quantity, () => debounceUpdate(quantity.value));

const removeCartItem = async () => {
  isLoading.value = true;
  await removeItem();
  isLoading.value = false;
};

</script>
<template>
  <li class="relative pb-6 border-b border-b-gray-200 flex">
    <div
      v-if="lineItem.type == 'product'"
      class="shrink-0 aspect-[2/3] w-[7.5rem] overflow-hidden bg-gray-200 mr-4 md:mr-6"
    >
      <img
        :src="getSmallestThumbnailUrl(lineItem.cover)"
        :alt="lineItem.label || ''"
        class="h-full w-full object-cover object-center"
      />
    </div>
    <div>
      <p class="text-md text-gray-900 font-medium mb-2">
        {{ lineItem.label }}
      </p>
      <div class="gap-2 text-sm mb-4">
      <span class="text-red-800">
        $40.00
      </span>
      <span class="line-through text-gray-500">
        $50.00
      </span>
      </div>
      <div class="flex flex-col gap-1 mb-4">
        <p v-for="option of (lineItem.payload as any)?.options" class="text-sm text-gray-500">
          {{option.group}}: {{option.option}}
        </p>
      </div>
      <p v-if="!enableActions" class="text-sm text-gray-500">
        Quantity: {{lineItem.quantity}}
      </p>
      <div v-else>
        <SwQuantitySelector class="!h-[38px] !w-[108px]" v-model="quantity" />
      </div>
    </div>
    <TrashIcon v-if="enableActions" class="shrink-0 cursor-pointer text-gray-700 ml-auto h-6 w-6" @click="removeCartItem" />
  </li>
</template>