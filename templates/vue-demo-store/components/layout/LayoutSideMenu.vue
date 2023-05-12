<script setup lang="ts">
import { getTranslatedProperty } from "@shopware-pwa/helpers-next";
import { RouterLink } from "vue-router";
import {
  getCategoryUrl,
} from "@shopware-pwa/helpers-next";
import { Category, StoreNavigationElement } from "@shopware-pwa/types";
import {
  Dialog,
  DialogPanel,
  TransitionRoot,
  TransitionChild
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

const goBack = () => {
  if (currentChildNavigationElement.value) {
    currentChildNavigationElement.value = null;
  } else if (currentNavigationElement.value) {
    currentNavigationElement.value = null;
  }
}

const firstNavigate = (value: Category) => {
  currentNavigationElement.value = value;
  if (!value.childCount) {
    close();
  }
}

const secondNavigate = (value: Category) => {
  currentChildNavigationElement.value = value;
  if (!value.childCount) {
    close();
  }
}

</script>

<template>
  <button class="lg:hidden" aria-label="menu" @click="isSideMenuOpened = true">
    <span class="sr-only">Open main menu</span>
    <Bars3Icon class="h-6 w-6" aria-hidden="true" />
  </button>
  <TransitionRoot
    :show="isSideMenuOpened"
    appear
    as="template"
  >
    <Dialog as="div" class="lg:hidden" @close="close">
      <TransitionChild
        as="template"
        enter="duration-300 ease-out"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="duration-200 ease-in"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 z-10 bg-gray-500 bg-opacity-60" />
      </TransitionChild>
      <TransitionChild
        as="template"
        enter="duration-300 ease-out"
        enter-from="opacity-0 scale-95"
        enter-to="opacity-100 scale-100"
        leave="duration-200 ease-in"
        leave-from="opacity-100 scale-100"
        leave-to="opacity-0 scale-95"
      >
        <DialogPanel class="fixed inset-y-0 z-50 right-0 w-full overflow-y-auto bg-white py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div class="px-4 flex items-center justify-between">
            <div>
              <ChevronLeftIcon 
                v-if="currentNavigationElement || currentChildNavigationElement"
                class="cursor-pointer h-6 w-6 text-gray-700"
                aria-hidden="true"
                @click="goBack"
              />
            </div>
            <div>
              <h4 class="font-medium text-lg">Menu</h4>
            </div>
            <button type="button" class="-m-2.5 rounded-md p-2.5 text-gray-700" @click="close">
              <span class="sr-only">Close menu</span>
              <XMarkIcon class="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <div class="border-t border-gray-200 mt-6 flow-root">
            <div class="divide-y divide-gray-500/10">
              <div class="">
                <template v-if="!currentNavigationElement && !currentChildNavigationElement">
                  <RouterLink 
                    v-for="navigationElement in navigationElements" 
                    :to="navigationElement.childCount ? '' : getCategoryUrl(navigationElement)" 
                    :key="navigationElement.id"
                    class="font-medium cursor-pointer flex justify-between items-center border-b border-gray-200 px-4 block py-3 text-base leading-7 text-gray-700 hover:bg-gray-50"
                    @click="firstNavigate(navigationElement)"
                  >
                    {{ getTranslatedProperty(navigationElement, "name") }}
                    <ChevronRightIcon v-if="navigationElement.childCount" class="h-6 w-6" aria-hidden="true" />
                  </RouterLink>
                </template>
                <template v-else-if="currentNavigationElement && !currentChildNavigationElement">
                  <RouterLink 
                    v-for="navigationElement in currentNavigationElement.children" 
                    :to="navigationElement.childCount ? '' : getCategoryUrl(navigationElement)" 
                    :key="navigationElement.id"
                    class="font-medium cursor-pointer flex justify-between items-center border-b border-gray-200 px-4 block rounded-lg py-3 text-base leading-7 hover:bg-gray-50"
                    @click="secondNavigate(navigationElement)"
                  >
                    {{ getTranslatedProperty(navigationElement, "name") }}
                    <ChevronRightIcon v-if="navigationElement.childCount" class="h-6 w-6" aria-hidden="true" />
                  </RouterLink>
                </template>
                <template v-else-if="currentChildNavigationElement">
                  <RouterLink
                    v-for="navigationElement in currentChildNavigationElement.children" 
                    :key="navigationElement.id"
                    @click="close"
                    :to="getCategoryUrl(navigationElement)"
                    class="cursor-pointer flex justify-between items-center border-b border-gray-200 px-4 block rounded-lg py-3 text-base leading-7 hover:bg-gray-50">
                      {{ getTranslatedProperty(navigationElement, "name") }}
                  </RouterLink>
                </template>
                <div class="flex gap-5 items-center bg-gray-50 px-6 block py-3 text-base leading-7 hover:bg-gray-50">
                  <LayoutCurrency />
                  <LayoutLanguage />
                </div>
              </div>
            </div>
          </div>
        </DialogPanel>
      </TransitionChild>
    </Dialog>
  </TransitionRoot>
</template>
