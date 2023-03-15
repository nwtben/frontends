<script setup lang="ts">
import { RouterLink } from "vue-router";
import { getTranslatedProperty, getSmallestThumbnailUrl } from "@shopware-pwa/helpers-next";
const { navigationElements } = useNavigation();

const currentMenuPosition = ref<string | null>(null);

const menuHtmlElement = ref(null);

onClickOutside(menuHtmlElement, () => (currentMenuPosition.value = null));
</script>

<template>
  <!-- eslint-disable vue/no-v-html -->
  <nav class="hidden lg:flex space-x-7 items-center">
    <div
      v-for="navigationElement in navigationElements"
      :key="navigationElement.id"
      ref="menuHtmlElement"
      class="relative"
      @mouseover="currentMenuPosition = navigationElement.id"
    >
      <RouterLink
        :to="'/' + navigationElement.seoUrls?.[0]?.seoPathInfo"
        class="flex items-center gap-1 text-base font-medium uppercase text-brand-dark"
      >
        {{ getTranslatedProperty(navigationElement, "name") }}
        <span class="h-5 w-5 i-carbon-chevron-down" />
      </RouterLink>

      <!--
            Flyout menu, show/hide based on flyout menu state.

            Entering: "transition ease-out duration-200"
              From: "opacity-0 translate-y-1"
              To: "opacity-100 translate-y-0"
            Leaving: "transition ease-in duration-150"
              From: "opacity-100 translate-y-0"
              To: "opacity-0 translate-y-1"
          -->
      <client-only>
        <div
          v-if="
            currentMenuPosition === navigationElement.id &&
              navigationElement?.children?.length
          "
          class="bg-white absolute z-10 mt-3 rounded-lg shadow-lg transform px-10 py-10 w-screen max-w-md xl:max-w-screen-sm lg:ml-0 lg:left-1/4 lg:-translate-x-1/6"
          @mouseleave="currentMenuPosition = null"
        >
          <ul
            class="flex gap-5"
          >
            <template
              v-for="(childElement, index) in navigationElement.children"
              :key="childElement.id"
            >
              <li
                class="relative min-w-[150px]"
              >
                <RouterLink
                  v-if="
                    typeof childElement?.seoUrls?.[0]?.seoPathInfo !==
                      'undefined'
                  "
                  :to="'/' + childElement?.seoUrls?.[0]?.seoPathInfo"
                  class="hover:bg-gray-50"
                >
                  <div
                    class="flex flex-col flex-grow"
                    :class="{
                      'max-w-200px md:max-w-300px': !!childElement.media,
                    }"
                  >
                    <p class="text-base font-medium text-gray-900">
                      {{ getTranslatedProperty(childElement, "name") }}
                    </p>
                  </div>
                </RouterLink>
                <div
                  v-else
                  class="px-4 py-2 sm:py-3"
                >
                  <p class="text-base font-medium text-gray-500">
                    {{ getTranslatedProperty(childElement, "name") }}
                  </p>
                </div>
                <ul
                  class="flex flex-col gap-4 mt-4"
                >
                  <template
                    v-for="(subChildElement, ind) in childElement.children"
                    :key="subChildElement.id"
                  >
                    <RouterLink
                      v-if="
                        typeof subChildElement?.seoUrls?.[0]?.seoPathInfo !==
                          'undefined'
                      "
                      :to="'/' + subChildElement?.seoUrls?.[0]?.seoPathInfo"
                      class="hover:bg-gray-50"
                    >
                      <div
                        class="flex flex-col flex-grow"
                        :class="{
                          'max-w-200px md:max-w-300px': !!subChildElement.media,
                        }"
                      >
                        <p class="text-base font-normal text-gray-400">
                          {{ getTranslatedProperty(subChildElement, "name") }}
                        </p>
                      </div>
                    </RouterLink>
                  </template>
                </ul>
              </li>
            </template>
          </ul>
        </div>
      </client-only>
    </div>
  </nav>
</template>
