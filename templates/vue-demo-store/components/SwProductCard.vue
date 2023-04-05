<script setup lang="ts">
import { RouterLink } from "vue-router";
import {
  BoxLayout,
  DisplayMode,
  // useProductPrice,
} from "@shopware-pwa/composables-next";
import {
  getProductName,
  getProductThumbnailUrl,
  getProductUrl,
  // getTranslatedProperty,
  getProductFromPrice,
} from "@shopware-pwa/helpers-next";
import {
  Product,
  // PropertyGroupOption,
} from "@shopware-pwa/types";
import SwListingProductPrice from "./SwListingProductPrice.vue";
import SharedReviews from './shared/SharedReviews.vue';
import SwAddToWishlist from './SwAddToWishlist.vue';

const props = withDefaults(
  defineProps<{
    product: Product;
    layoutType?: BoxLayout;
    isProductListing?: boolean;
    displayMode?: DisplayMode;
  }>(),
  {
    layoutType: "standard",
    displayMode: "standard",
    isProductListing: false,
  }
);
const { product } = toRefs(props);
</script>

<template>
  <div
    class="sw-product-card group relative flex flex-col justify-between"
    data-testid="product-box"
  >
    <SwAddToWishlist 
      class="absolute top-2 right-2 rounded-full bg-white opacity-50 p-1"
      :product="product"
    />
    <div class="aspect-[2/3] w-full overflow-hidden bg-gray-300">
      <img
        :src="getProductThumbnailUrl(product)"
        :alt="getProductName({ product }) || ''"
        class="h-full w-full object-cover object-center lg:h-full lg:w-full"
      />
    </div>
    <div class="mt-4 flex justify-between">
      <div>
        <h3 class="text-base p-0">
          <RouterLink
            class="line-clamp-2 h-6 font-medium text-base text-start"
            :to="getProductUrl(product)"
            data-testid="product-box-product-name-link"
          >
            {{ getProductName({ product }) }}
          </RouterLink>
        </h3>
        <SwListingProductPrice
          :product="product"
          class="ml-auto"
          data-testid="product-box-product-price"
        />
        <SharedReviews :product="product" />
      </div>
    </div>
  </div>
</template>
