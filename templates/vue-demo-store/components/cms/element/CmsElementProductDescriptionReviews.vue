<script setup lang="ts">
import type { CmsElementProductDescriptionReviews } from "@shopware-pwa/composables-next";
import {
  getTranslatedProperty,
  getProductName,
} from "@shopware-pwa/helpers-next";
import SwProductReviews from "../../SwProductReviews.vue";

const DUMMY_REVIEWS: any = [
  {
    id: 1,
    createdAt: new Date().toISOString(),
    content: `I was looking for a bright light for the kitchen but wanted some item more modern than a strip light. this one is perfect, very bright and looks great. I can't comment on interlation as I had an electrition instal it. Would recommend...`,
    points: 4,
    customer: {
      id: 1,
      firstName: 'Jane D.',
      lastName: 'Smith'
    }
  },
  {
    id: 2,
    createdAt: new Date().toISOString(),
    content: `I was looking for a bright light for the kitchen but wanted some item more modern than a strip light. this one is perfect, very bright and looks great. I can't comment on interlation as I had an electrition instal it. Would recommend...`,
    points: 4,
    customer: {
      id: 2,
      firstName: 'Jane D.',
      lastName: 'Smith'
    }
  }
]


const tabs = ref([
  { name: 'Description', href: '#description' },
  { name: 'Specification', href: '#specification' },
  { name: 'Reviews', href: '#reviews' },
  { name: 'Delivery and returns', href: '#dar' },
]);

const currentTabHash = ref<string>('#reviews');

const route = useRoute();

const props = defineProps<{
  content: CmsElementProductDescriptionReviews;
}>();
const { product } = useProduct(props.content.data?.product);

const description = computed(() =>
  getTranslatedProperty(product.value, "description")
);

const reviews = computed(() => DUMMY_REVIEWS || props.content.data.reviews?.elements);

watch(
  () => route.hash,
  hash => {
    currentTabHash.value = hash;
  }
)
</script>

<template>
  <div
    class="cms-block-product-description-reviews flex flex-wrap"
    v-if="product"
  >
    <div class="sm:hidden">
      <label for="tabs" class="sr-only">Select a tab</label>
      <select id="tabs" name="tabs" class="block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-sm font-medium text-gray-700 focus:border-gray-500 focus:outline-none focus:ring-gray-500">
        <option v-for="tab in tabs" :key="tab.name" :selected="currentTabHash === tab.href">{{ tab.name }}</option>
      </select>
    </div>
    <div class="w-full hidden sm:block">
      <div class="border-b border-gray-200">
        <nav class="-mb-px flex space-x-8" aria-label="Tabs">
          <a v-for="tab in tabs" :key="tab.name" :href="tab.href" :class="[currentTabHash === tab.href ? 'border-gray-900' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700', 'whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium']" :aria-current="currentTabHash === tab.href ? 'page' : undefined">{{ tab.name }}</a>
        </nav>
      </div>
    </div>
    <div class="w-full mt-10">
      <div class="tab-content tab-space">
        <div
          :class="[
            'cms-block-product-description-reviews__description',
            currentTabHash !== tabs[0].href ? 'hidden' : 'block',
          ]"
        >
          <p class="text-xl font-bold mt-3">
            {{ getProductName({ product }) }}
          </p>
          <div class="mt-2" v-html="description"></div>
        </div>
        <div
          :class="[
            'cms-block-product-description-reviews__reviews',
            currentTabHash !== tabs[2].href ? 'hidden' : 'block',
          ]"
        >
          <SwProductReviews :product="product" :reviews="reviews" />
        </div>
      </div>
    </div>
  </div>
</template>
