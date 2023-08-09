<script setup lang="ts">
import type { Product } from "@shopware-pwa/types";
import {
  getSmallestThumbnailUrl,
  getTranslatedProperty,
} from "@shopware-pwa/helpers-next";
import SharedProductPrice from "../shared/SharedProductPrice.vue";

const props = defineProps<{ product: Product }>();

const { product } = toRefs(props);
</script>
<template>
  <div
    class="p-3 text-sm flex gap-3 hover:bg-gray-100 cursor-pointer transition duration-300 bg-white"
  >
    <div class="overflow-hidden flex-none">
      <img
        data-testid="layout-search-suggest-image"
        :src="getSmallestThumbnailUrl(product.cover.media)"
        class="h-16 w-16 object-cover"
        alt="Product image"
        loading="lazy"
      />
    </div>
    <div class="flex flex-col overflow-hidden">
      <h5
        class="text-gray-900 font-medium text-sm whitespace-nowrap overflow-hidden text-ellipsis"
      >
        {{ getTranslatedProperty(product, "name") }}
      </h5>
      <div class="flex-none">
        <SharedProductPrice
          :product="product"
          :size="'small'"
        />
      </div>
    </div>
  </div>
</template>
