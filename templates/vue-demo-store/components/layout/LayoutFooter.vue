<script setup lang="ts">
import { RouterLink } from "vue-router";
import { getTranslatedProperty } from "@shopware-pwa/helpers-next";

const { navigationElements } = useNavigation({ type: "footer-navigation" });
const gridColumns = computed<number>(() =>
  navigationElements.value
    ? Object.keys(navigationElements.value).length + 2
    : 2
);
</script>

<template>
  <footer class="w-full bg-brand-primary" aria-labelledby="footer-heading">
    <h2 id="footer-heading" class="sr-only">Footer</h2>
    <div class="container mx-auto flex flex-col justify-center">
      <div
        class="w-full py-10 grid grid-cols-2 md:grid-cols-4"
      >
        <div
          v-for="navigationElement in navigationElements"
          :key="navigationElement.id"
        >
          <h4 class="mb-5 text-gray-300 uppercase font-semibold text-sm">
            {{ getTranslatedProperty(navigationElement, "name") }}
          </h4>
          <template v-if="navigationElement.childCount > 0">
            <ul role="list" class="list-none p-0 mb-5">
              <li
                v-for="navigationChild in navigationElement.children"
                :key="navigationChild.id"
                class="pb-3 md:pb-1"
              >
                <RouterLink
                  :to="'/' + navigationChild.seoUrls[0]?.seoPathInfo"
                  class="text-base font-normal text-gray-200"
                >
                  {{ getTranslatedProperty(navigationChild, "name") }}
                </RouterLink>
              </li>
            </ul>
          </template>
        </div>
      </div>
      <div
        class="w-full py-10 grid grid-cols-1 gap-8 md:gap-0 md:grid-cols-2"
      >
        <div>
          <h4 class="mb-2 text-gray-300 uppercase font-semibold text-sm">
            SOCIAL
          </h4>
          <div class="flex space-x-4">
            <div class="text-gray-200 w-5 h-5 i-custom:facebook" />
            <div class="text-gray-200 w-5 h-5 i-carbon-logo-instagram" />
            <div class="text-gray-200 w-5 h-5 i-carbon-logo-twitter" />
            <div class="text-gray-200 w-5 h-5 i-carbon-logo-youtube" />
          </div>
        </div>
        <div>
          <h4 class="mb-2 text-gray-300 uppercase font-semibold text-sm">
            PAYMENT
          </h4>
          <div class="flex space-x-4">
            <img src="/svg/klarna.svg" />
            <img src="/svg/visa.svg" />
            <img src="/svg/mastercard.svg" />
            <img src="/svg/swish.svg" />
          </div>
        </div>
      </div>
      <div class="border-t border-gray-600"></div>
      <p class="text-gray-300 mt-8 mb-16 text-center">© 2023 Stylad, All rights reserved.</p>
    </div>
  </footer>
</template>
