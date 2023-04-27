<script setup lang="ts">
import { getTranslatedProperty } from "@shopware-pwa/helpers-next";
import { RouterLink } from "vue-router";
import {
  getCategoryUrl,
} from "@shopware-pwa/helpers-next";
import { StoreNavigationElement } from "@shopware-pwa/types";
import {
  Dialog,
  DialogPanel,
} from '@headlessui/vue';
import {
  XMarkIcon,
  Bars3Icon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/vue/24/outline'

const { navigationElements } = useNavigation();

const currentNavigationElement = ref<StoreNavigationElement | null>();
const currentChildNavigationElement = ref<StoreNavigationElement | null>();

const isSideMenuOpened = inject("isSideMenuOpened", ref(false));

const close = () => {
  isSideMenuOpened.value = false;
  currentNavigationElement.value = null;
  currentChildNavigationElement.value = null;
}
</script>

<template>
  <button class="lg:hidden" aria-label="menu" @click="isSideMenuOpened = true">
    <span class="sr-only">Open main menu</span>
    <Bars3Icon class="h-6 w-6" aria-hidden="true" />
  </button>
  <Dialog as="div" class="lg:hidden" @close="close" :open="isSideMenuOpened">
    <div class="fixed inset-0 z-10" />
    <DialogPanel class="fixed inset-y-0 z-50 right-0 w-full overflow-y-auto bg-white py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
      <div class="px-6 flex items-center justify-between">
        <div></div>
        <div>
          <h4 class="font-medium text-lg">Menu</h4>
        </div>
        <button type="button" class="-m-2.5 rounded-md p-2.5 text-gray-700" @click="close">
          <span class="sr-only">Close menu</span>
          <XMarkIcon class="h-6 w-6" aria-hidden="true" />
        </button>
      </div>
      <div class="mt-6 flow-root">
        <div class="-my-6 divide-y divide-gray-500/10">
          <div class="py-6">
            <a v-for="navigationElement in navigationElements" :key="navigationElement.id" class="font-medium cursor-pointer flex justify-between items-center border-b border-gray-200 px-6 -mx-3 block py-3 text-base leading-7 text-gray-700 hover:bg-gray-50" @click="currentNavigationElement = navigationElement">
              {{ getTranslatedProperty(navigationElement, "name") }}
              <ChevronRightIcon class="h-5 w-5" aria-hidden="true" />
            </a>
            <div class="flex gap-5 items-center bg-gray-50 px-6 -mx-3 block py-3 text-base leading-7 hover:bg-gray-50">
              <LayoutCurrency />
              <LayoutLanguage />
            </div>
          </div>
        </div>
      </div>
    </DialogPanel>
    <DialogPanel v-if="currentNavigationElement" class="fixed z-50 inset-y-0 right-0 w-full overflow-y-auto bg-white py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
      <div class="px-6 flex items-center justify-between">
        <div><ChevronLeftIcon class="h-6 w-6 text-gray-700" aria-hidden="true" @click="currentNavigationElement = null" /></div>
        <div>
          <h4 class="font-medium text-lg">{{ getTranslatedProperty(currentNavigationElement, "name") }}</h4>
        </div>
        <button type="button" class="-m-2.5 rounded-md p-2.5 text-gray-700" @click="close">
          <span class="sr-only">Close menu</span>
          <XMarkIcon class="h-6 w-6" aria-hidden="true" />
        </button>
      </div>
      <div class="mt-6 flow-root">
        <div class="-my-6 divide-y divide-gray-500/10">
          <div class="py-6">
            <a v-for="navigationElement in currentNavigationElement.children" :key="navigationElement.id" class="font-medium cursor-pointer flex justify-between items-center border-b border-gray-200 px-6 -mx-3 block rounded-lg py-3 text-base leading-7 hover:bg-gray-50" @click="currentChildNavigationElement = navigationElement">
              {{ getTranslatedProperty(navigationElement, "name") }}
              <ChevronRightIcon class="h-5 w-5" aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </DialogPanel>
    <DialogPanel v-if="currentChildNavigationElement" class="fixed z-50 inset-y-0 right-0 w-full overflow-y-auto bg-white py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
      <div class="px-6 flex items-center justify-between">
        <div><ChevronLeftIcon class="h-6 w-6 text-gray-700" aria-hidden="true" @click="currentChildNavigationElement = null" /></div>
        <div>
          <h4 class="font-medium text-lg">{{ getTranslatedProperty(currentChildNavigationElement, "name") }}</h4>
        </div>
        <button type="button" class="-m-2.5 rounded-md p-2.5 text-gray-700" @click="close">
          <span class="sr-only">Close menu</span>
          <XMarkIcon class="h-6 w-6" aria-hidden="true" />
        </button>
      </div>
      <div class="mt-6 flow-root">
        <div class="-my-6 divide-y divide-gray-500/10">
          <div class="py-6">
            <RouterLink
              v-for="navigationElement in currentChildNavigationElement.children" 
              :key="navigationElement.id"
              @click="close"
              :to="getCategoryUrl(navigationElement)"
              class="cursor-pointer flex justify-between items-center border-b border-gray-200 px-6 -mx-3 block rounded-lg py-3 text-base leading-7 hover:bg-gray-50">
                {{ getTranslatedProperty(navigationElement, "name") }}
            </RouterLink>
          </div>
        </div>
      </div>
    </DialogPanel>
  </Dialog>
</template>
