<script setup lang="ts">
import { OrderLineItem, LineItem } from '@shopware-pwa/types';
import { getSmallestThumbnailUrl, getProductUrl } from "@shopware-pwa/helpers-next";
import SwQuantitySelector from '../SwQuantitySelector.vue';
import { getPath } from '~/helpers';
import {
  TrashIcon,
} from '@heroicons/vue/24/outline';

const props = defineProps<{
  lineItem: OrderLineItem | LineItem;
  enableActions?: boolean;
  preventLastItem?: boolean;
}>();

const { lineItem } = toRefs(props);
const isOpen = inject<boolean>("isSidebarOpen");
const isLoading = ref(false);

const price = computed(() => {
  return (props.lineItem as LineItem).price?.unitPrice || (props.lineItem as OrderLineItem)?.priceDefinition?.price
});

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
  <li 
    :class="{
      'relative py-6 border-b border-b-gray-200 flex': true,
      'last:border-0 last:pb-0': !preventLastItem
    }"
  >
    <div
      v-if="lineItem.type == 'product'"
      class="shrink-0 aspect-[2/3] w-[7.5rem] overflow-hidden bg-gray-200 mr-4 md:mr-6"
    >
      <nuxt-link :to="getProductUrl(lineItem as any)" @click="isOpen = false">
        <nuxt-img
          :src="getPath(getSmallestThumbnailUrl(lineItem.cover) ?? '')"
          :alt="lineItem.label || ''"
          class="h-full w-full object-cover object-center"
          loading="lazy"
        />
      </nuxt-link>
    </div>
    <div>
      <nuxt-link :to="getProductUrl(lineItem as any)" @click="isOpen = false" class="text-md text-gray-900 font-medium mb-2 block">
        {{ lineItem.label }}
      </nuxt-link>
      <div class="gap-2 text-sm mb-4">
      <SharedPrice
        :value="price"
        data-testid="cart-subtotal"
      />
      </div>
      <div class="flex flex-col gap-1 mb-4">
        <p v-for="option of (lineItem.payload as any)?.options" class="text-sm text-gray-500">
          {{option.group}}: {{option.option}}
        </p>
      </div>
      <template v-if="lineItem.type === 'product'">
        <p v-if="!enableActions" class="text-sm text-gray-500">
          Quantity: {{lineItem.quantity}}
        </p>
        <div v-else>
          <SwQuantitySelector class="!h-[38px] !w-[108px]" v-model="quantity" />
        </div>
      </template>
    </div>
    <TrashIcon v-if="enableActions" class="shrink-0 cursor-pointer text-gray-700 ml-auto h-6 w-6" @click="removeCartItem" />
  </li>
</template>