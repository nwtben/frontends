<script setup lang="ts">
import { RouterLink } from "vue-router";
import {
  TrashIcon,
} from '@heroicons/vue/24/outline';

const props = defineProps<{
  showTitle?: boolean;
  showCartItems?: boolean;
}>();

const isAddDiscountCode = ref<boolean>();
const discountCode = ref<string>();

const { cartItems, cart, subtotal, shippingTotal, totalPrice, addPromotionCode, appliedPromotionCodes } = useCart();
const promotionErrors = computed(() => {
  const errors = cart.value?.errors;
  const promotionErrTemp: any[] = [];
  if (!discountCode.value || !isAddDiscountCode.value) return [];
  if (errors) {
    const getErrors = Object.keys(errors).filter(x => x.startsWith('promotion'));
    getErrors.forEach(x => {
      if ((errors[x] as any)?.promotionCode === discountCode.value) {
        promotionErrTemp.push(errors[x]);
      }
    })
  }
  return promotionErrTemp;
})

const handleSubmitPromotionCode = () => {
  if (discountCode.value) {
    addPromotionCode(discountCode.value);
  }
}
</script>

<template>
  <SharedProductOrders v-if="props.showCartItems" :is-container="true" class="bg-gray-50" :enableActions="true" :lineItems="cartItems || []" />
  <div class="bg-gray-50 py-6 px-4 md:p-8">
    <h5 v-if="props.showTitle" class="text-xl font-medium text-dark-primary mb-8.5">Order summary</h5>
    <div class="flex flex-col gap-6">
      <SharedCheckbox v-model="isAddDiscountCode" content="Add discount code" />
      <div class="flex flex-col gap-1" v-if="isAddDiscountCode">
        <div class="flex gap-4">
          <input
            type="text"
            v-model="discountCode"
            class="appearance-none relative block w-full px-3 py-2 border placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:z-10 sm:text-sm"
            :class="promotionErrors.length ? 'border-red-600' : ''"
          />
          <button @click="handleSubmitPromotionCode" :disabled="!discountCode" class="disabled:opacity-70 flex items-center justify-center px-3 py-1 text-xs font-medium text-white shadow-sm bg-gray-800">
            Submit
          </button>
        </div>
        <div v-if="promotionErrors.length">
          <p class="text-sm text-red-600" v-for="err of promotionErrors">{{ err.message }}</p>
        </div>
      </div>
      <ul v-if="appliedPromotionCodes.length">
        <li class="flex items-center text-sm" v-for="code of appliedPromotionCodes" :key="code.id">
          <span>{{ code.referencedId }}</span>
          <!-- <TrashIcon class="shrink-0 cursor-pointer text-gray-700 ml-auto h-6 w-6" /> -->
        </li>
      </ul>
      <div class="border-b border-gray-200"></div>
      <div class="flex justify-between text-base">
        <p>Subtotal</p>
        <SharedPrice
          :value="subtotal"
          data-testid="cart-subtotal"
        />
      </div>
      <div class="flex justify-between text-base">
        <p>Shipping estimate</p>
        <SharedPrice
          :value="shippingTotal"
          data-testid="cart-subtotal"
        />
      </div>
      <div class="border-b border-gray-200"></div>
      <div class="flex justify-between text-lg text-dark-primary font-medium">
        <p>Order total</p>
        <SharedPrice :value="totalPrice" data-testid="cart-subtotal" />
      </div>
    </div>
    <slot name="action"></slot>
    <!-- <RouterLink
      v-if="props.showCheckoutBtn"
      class="flex items-center justify-center mt-8 px-6 py-3 text-base font-medium text-white shadow-sm bg-gray-800"
      to="/checkout"
      data-testid="cart-checkout-link"
    >
      Checkout
    </RouterLink> -->
  </div>
</template>
