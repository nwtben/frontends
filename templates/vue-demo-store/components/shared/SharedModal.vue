<script setup lang="ts">
import {
  Dialog,
  DialogPanel,
  TransitionRoot,
  TransitionChild
} from '@headlessui/vue';

export type SharedModal = {
  modalContent: string;
  modalProps: object | null;
  open: (component: string, props?: object | null) => void;
  close: () => void;
};

const { close, modalContent, modalProps } = inject<SharedModal>(
  "modal"
) as SharedModal;
</script>

<template>
  <TransitionRoot
    :show="!!modalContent.length"
    appear
    as="template"
  >
    <Dialog
      as="div" 
      class="fixed z-10 inset-0 overflow-y-auto"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
      @close="close"
    >
      <TransitionChild
        as="template"
        enter="duration-300 ease-out"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="duration-200 ease-in"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 z-50 bg-gray-500 bg-opacity-60" />
      </TransitionChild>
      <TransitionChild
        as="template"
        enter="duration-300 ease-out"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="duration-200 ease-in"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <DialogPanel class="flex flex-col fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 sm:max-w-lg sm:w-full overflow-y-auto bg-white sm:ring-1 sm:ring-gray-900/10">
          <component :is="modalContent" v-bind="modalProps" @close="close" />
        </DialogPanel>
      </TransitionChild>
    </Dialog>
  </TransitionRoot>
</template>
