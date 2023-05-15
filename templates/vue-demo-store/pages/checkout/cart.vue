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
const isAddDiscountCode = ref<boolean>();
const discountCode = ref<string>();

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

const { cartItems, cart, subtotal, totalPrice, shippingTotal, addPromotionCode } = useCart();

const handleSubmitPromotionCode = () => {
  if (discountCode.value) {
    addPromotionCode(discountCode.value);
  }
}

const hasItems = computed(() => cartItems.value.length > 0);

onMounted(async () => {
  await getOtherProducts({
    limit: 6,
    query: 'M'
  });
});

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
        <SharedOrdersSummary :showTitle="true">
          <template #action>
            <RouterLink
              class="flex items-center justify-center mt-8 px-6 py-3 text-base font-medium text-white shadow-sm bg-gray-800"
              to="/checkout"
              data-testid="cart-checkout-link"
            >
              Checkout
            </RouterLink>
          </template>
        </SharedOrdersSummary>
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
