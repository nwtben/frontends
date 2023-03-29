<script setup lang="ts">
import { RouterLink } from "vue-router";
import { getTranslatedProperty } from "@shopware-pwa/helpers-next";
import {
  Popover,
  PopoverButton,
  PopoverGroup,
  PopoverPanel,
} from '@headlessui/vue';
import {
  ChevronDownIcon,
} from '@heroicons/vue/24/outline';

const { navigationElements } = useNavigation();
</script>

<template>
  <!-- eslint-disable vue/no-v-html -->
  <PopoverGroup class="hidden lg:flex space-x-7 items-center">
    <Popover
      v-for="navigationElement in navigationElements"
      :key="navigationElement.id"
      class="relative"
    >
      <PopoverButton class="flex items-center gap-1 text-base font-medium uppercase text-current">
        {{ getTranslatedProperty(navigationElement, "name") }}
        <ChevronDownIcon v-if="navigationElement.children?.length" class="h-5 w-5 flex-none text-current" aria-hidden="true" />
      </PopoverButton>

      <transition v-if="navigationElement.children?.length" enter-active-class="transition ease-out duration-200" enter-from-class="opacity-0 translate-y-1" enter-to-class="opacity-100 translate-y-0" leave-active-class="transition ease-in duration-150" leave-from-class="opacity-100 translate-y-0" leave-to-class="opacity-0 translate-y-1">
        <PopoverPanel class="absolute -left-8 top-full z-10 mt-3 w-screen max-w-md overflow-hidden bg-white shadow-lg ring-1 ring-gray-900/5">
          <div class="flex gap-4 p-4">
            <div v-for="(childElement, index) in navigationElement.children" :key="childElement.id" class="group relative flex gap-x-6 rounded-lg p-4 text-sm leading-6 hover:bg-gray-50">
              <div class="flex-auto">
                <RouterLink :to="'/' + childElement?.seoUrls?.[0]?.seoPathInfo" class="block font-semibold text-gray-900">
                  {{ childElement.name }}
                  <span class="absolute inset-0" />
                </RouterLink>
                <p class="mt-1 text-gray-600">{{ childElement.description }}</p>
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
              </div>
            </div>
          </div>
        </PopoverPanel>
      </transition>
    </Popover>
  </PopoverGroup>
</template>
