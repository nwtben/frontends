<script setup lang="ts">
import { RouterLink } from "vue-router";
import SharedProductOrders from '../../components/shared/SharedProductOrders.vue';
import SharedValueProposition from '../../components/shared/SharedValueProposition.vue';
import { ShopwareSearchParams } from "@shopware-pwa/types";
import { searchProducts } from "@shopware-pwa/api-client";

const defaultConfig = ref<any>({
  "type": "product-slider",
  "slot": "productSlider",
  "config": {
    "border": {
      "value": false,
      "source": "static"
    },
    "rotate": {
      "value": false,
      "source": "static"
    },
    "boxLayout": {
      "value": "standard",
      "source": "static"
    },
    "elMinWidth": {
      "value": "300px",
      "source": "static"
    },
    "navigation": {
      "value": true,
      "source": "static"
    },
    "displayMode": {
      "value": "standard",
      "source": "static"
    },
    "verticalAlign": {
      "value": null,
      "source": "static"
    },
  },
  "data": {
    "products": [],
  },
});

const { apiInstance } = useShopwareContext();

const getOtherProducts = async (
  criteria?: Partial<ShopwareSearchParams>,
) => {
  // get dummy products from server
  try {
    const response = await searchProducts(criteria, apiInstance);
    defaultConfig.value.data.products = response.elements;
  } catch (e) {
    throw e;
  }
}

const { cartItems, subtotal, totalPrice, shippingTotal } = useCart();

const hasItems = computed(() => cartItems.value.length > 0);

onMounted(async () => {
  await getOtherProducts({
    limit: 6,
    query: 'M'
  });
});
</script>

<script lang="ts">
export default {
  name: "CartPage",
};
</script>

<template>
  <div class="container">
    <h2 class="mt-16 mb-12 font-extrabold text-3xl md:font-normal md:text-4xl">Shopping Cart</h2>
    <div class="flex flex-col md:flex-row gap-12 mb-24 md:mb-20" v-if="hasItems">
      <SharedProductOrders :enableActions="true" class="flex-1" :lineItems="cartItems || []" />
      <aside class="w-full md:w-1/2 md:max-w-[469px]">
        <div class="bg-gray-50 py-6 px-4 md:p-8">
          <h5 class="text-xl font-medium text-dark-primary mb-8.5">Order summary</h5>
          <div class="flex flex-col gap-6">
            <SharedCheckbox content="Add discount code" />
            <div class="border border-b-gray-200"></div>
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
            <div class="border border-b-gray-200"></div>
            <div class="flex mb-8 justify-between text-lg text-dark-primary font-medium">
              <p>Order total</p>
              <SharedPrice :value="totalPrice" data-testid="cart-subtotal" />
            </div>
          </div>
          <RouterLink
            class="flex items-center justify-center px-6 py-3 text-base font-medium text-white shadow-sm bg-gray-800"
            to="/checkout"
            data-testid="cart-checkout-link"
          >
            Checkout
          </RouterLink>
        </div>
        <div class="mt-6">
          <SharedValueProposition :isColumn="true" />
        </div>
      </aside>
    </div>
    <h3 v-else class="m-10 text-center text-2xl font-medium text-gray-900">
      Your cart is empty!
    </h3>
    <div class="mb-27.5 md:mb-47" v-if="defaultConfig.data?.products?.length">
      <h4 class="text-lg md:text-2xl text-center mb-6 md:mb-8">Other products you might like</h4>
      <CmsElementProductSlider :content="defaultConfig" />
    </div>
  </div>
</template>
