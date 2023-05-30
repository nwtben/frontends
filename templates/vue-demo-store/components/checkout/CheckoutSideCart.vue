<script setup lang="ts">
import {
  XMarkIcon
} from '@heroicons/vue/24/outline';
const isOpen = inject("isSidebarOpen");

const { cartItems, subtotal, shippingTotal, totalPrice, isEmpty } = useCart();

const close = () => {
  (isOpen as any).value = false;
}
</script>

<template>
  <div
    v-if="isOpen"
    class="z-50 fixed inset-0 overflow-hidden"
    aria-labelledby="slide-over-title"
    role="dialog"
    aria-modal="true"
  >
    <div class="absolute inset-0 overflow-hidden">
      <!--
      Background overlay, show/hide based on slide-over state.

      Entering: "ease-in-out duration-500"
        From: "opacity-0"
        To: "opacity-100"
      Leaving: "ease-in-out duration-500"
        From: "opacity-100"
        To: "opacity-0"
    -->
      <div
        v-if="isOpen"
        class="absolute inset-0 bg-gray-500 bg-opacity-60 transition-opacity"
        aria-hidden="true"
        @click="isOpen = false"
      />

      <div
        class="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10 z-50"
      >
        <!--
        Slide-over panel, show/hide based on slide-over state.

        Entering: "transform transition ease-in-out duration-500 sm:duration-700"
          From: "translate-x-full"
          To: "translate-x-0"
        Leaving: "transform transition ease-in-out duration-500 sm:duration-700"
          From: "translate-x-0"
          To: "translate-x-full"
      -->
        <div v-if="isOpen" class="pointer-events-auto w-screen max-w-sm">
          <div class="flex h-full flex-col bg-white shadow-xl p-6">
            <div class="flex flex-col h-full gap-6">
              <div class="flex items-start justify-between">
                <h2
                  id="slide-over-title"
                  class="text-lg font-medium text-gray-900 py-0"
                >
                  Cart ({{cartItems.length}})
                </h2>
                <div class="ml-3 flex h-7 items-center">
                  <button
                    type="button"
                    class="-m-2 p-2 text-gray-400 hover:text-gray-500"
                    @click="isOpen = false"
                  >
                    <span class="sr-only">Close panel</span>
                    <XMarkIcon class="w-6 h-6" />
                  </button>
                </div>
              </div>

              <div v-if="isEmpty" class="flex-1 min-h-0 text-center flex flex-col justify-center">
                <h4 class="mb-2 font-medium text-2xl text-dark-primary">Your cart is empty</h4>
                <p class="mb-6 text-base text-gray-500">Looks like you haven’t added any items to the cart yet. Start shopping to fill it in.</p>
                <nuxt-link to="/" @click="close" class="bg-gray-100 shadow-sm px-6 py-3 text-base font-medium">Start Shopping</nuxt-link>
              </div>

              <div v-else class="flex flex-col flex-1 min-h-0 gap-6">
                <div class="flex-1 min-h-0 overflow-y-auto">
                  <SharedProductOrders :isMiniCart="true" :enableActions="true" class="flex-1" :lineItems="cartItems || []" />
                </div>
                <div class="flex flex-col mt-auto">
                  <div class="flex flex-col gap-2">
                    <div class="flex justify-between text-base text-gray-500">
                      <p>Subtotal</p>
                      <SharedPrice
                        :value="subtotal"
                        data-testid="cart-subtotal"
                      />
                    </div>
                    <div class="flex justify-between text-base text-gray-500">
                      <p>Shipping estimate</p>
                      <SharedPrice
                        :value="shippingTotal"
                        data-testid="cart-subtotal"
                      />
                    </div>
                    <div class="flex justify-between text-lg text-gray-900 font-medium">
                      <p>Order total</p>
                      <SharedPrice :value="totalPrice" data-testid="cart-subtotal" />
                    </div>
                  </div>
                  <div class="flex flex-col">
                    <nuxt-link
                      class="mt-3 flex text-white items-center justify-center px-5 py-3 text-base font-medium text-white shadow-sm bg-gray-800"
                      :to="'/checkout'"
                      @click="close"
                    >
                      Go to checkout
                    </nuxt-link>
                    <nuxt-link
                      class="font-medium text-gray-900 mt-6 text-center underline underline-offset-4"
                      @click="close"
                      :to="'/checkout/cart'">
                      Show Shopping cart
                    </nuxt-link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
