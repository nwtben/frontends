<script setup lang="ts">
import { Order } from '@shopware-pwa/types';
import { getSmallestThumbnailUrl, getTranslatedProperty } from "@shopware-pwa/helpers-next";
import SharedPrice from './SharedPrice.vue';

const props = defineProps<{
  order: Order;
}>();
const {
  loadOrderDetails,
  billingAddress,
  shippingAddress,
  paymentMethod,
  shippingMethod,
  order,
} = useOrderDetails(props.order.id);

onMounted(() => {
  loadOrderDetails();
});
</script>

<template>
  <div v-if="order">
    <ul>
      <li v-for="lineItem of order?.lineItems" class="pb-10 mb-10 border-b border-b-gray-200 flex">
        <div
          v-if="lineItem.type == 'product'"
          class="aspect-[2/3] w-[7.5rem] overflow-hidden bg-gray-200 mr-6"
        >
          <img
            :src="getSmallestThumbnailUrl(lineItem.cover)"
            :alt="lineItem.label"
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
          <p class="text-sm text-gray-500">
            Quantity: {{lineItem.quantity}} {{ lineItem.price?.totalPrice }}
          </p>
        </div>
      </li>
    </ul>

    <div class="border-b border-b-gray-200 text-gray-900">
    <div class="mb-6 flex justify-between">
      <span>Subtotal</span>
      <SharedPrice :value="order?.price?.totalPrice" />
    </div>
    <div class="mb-6 flex justify-between">
        <span>Shipping estimate</span>
        <SharedPrice :value="order?.shippingTotal" />
    </div>
    </div>

    <div class="py-6 border-b border-b-gray-200 text-gray-900 flex items-center justify-between text-lg font-medium">
      <span>Order total</span>
      <SharedPrice :value="order?.amountTotal" />
    </div>

    <div class="py-6 border-b border-b-gray-200 text-gray-900 grid grid-cols-2 text-sm">
    <div>
      <p class="font-medium text-gray-900 mb-2">
        Shipping address
      </p>
      <p class="text-sm text-gray-500">
        {{shippingAddress?.firstName}} {{shippingAddress?.lastName}} <br/>
        {{shippingAddress?.street}}  <br/>
        {{shippingAddress?.zipcode}} {{shippingAddress?.city}}<br/>
      </p>
    </div>
    <div>
      <p class="font-medium text-gray-900 mb-2">
        Billing Address
      </p>
      <p class="text-sm text-gray-500">
        {{billingAddress?.firstName}} {{billingAddress?.lastName}} <br/>
        {{billingAddress?.street}}  <br/>
        {{billingAddress?.zipcode}} {{billingAddress?.city}}<br/>
      </p>
    </div>
    </div>
    <div class="pt-6 text-gray-900 grid grid-cols-2 text-sm">
    <div>
      <p class="font-medium text-gray-900 mb-2">
        Payment method
      </p>
      <p class="text-sm text-gray-500">
        {{ getTranslatedProperty(paymentMethod, 'name') }}
      </p>
    </div>
    <div>
      <p class="font-medium text-gray-900 mb-2">
        Shipping method
      </p>
      <p class="text-sm text-gray-500">
        {{ getTranslatedProperty(shippingMethod, 'name') }}<br/>
        {{ getTranslatedProperty(shippingMethod?.deliveryTime, 'name') }}
      </p>
    </div>
    </div>
  </div>
</template>