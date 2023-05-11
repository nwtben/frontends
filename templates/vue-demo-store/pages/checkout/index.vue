<script lang="ts">
export default {
  name: "CheckoutPage",
};
</script>
<script setup lang="ts">
import { SharedModal } from "~~/components/shared/SharedModal.vue";
import { RadioGroup, RadioGroupLabel, RadioGroupOption } from '@headlessui/vue';
import { useVuelidate } from "@vuelidate/core";
import { required, email, minLength, requiredIf } from "@vuelidate/validators";
import { ClientApiError, ShopwareError } from "@shopware-pwa/types";
import {
  CheckCircleIcon,
} from '@heroicons/vue/20/solid';

definePageMeta({
  layout: "checkout",
});

const isSameBillingAndShipping = ref();
const { push } = useRouter();
const { currency } = useSessionContext();
const { getCountries } = useCountries();
const { getSalutations } = useSalutations();
const {
  paymentMethods,
  shippingMethods,
  getPaymentMethods,
  getShippingMethods,
  createOrder,
} = useCheckout();
const { register, logout, isLoggedIn, isGuestSession, user } = useUser();
const {
  refreshSessionContext,
  selectedShippingMethod: shippingMethod,
  selectedPaymentMethod: paymentMethod,
  setShippingMethod,
  setPaymentMethod,
  activeShippingAddress,
  setActiveShippingAddress,
  activeBillingAddress,
  setActiveBillingAddress,
} = useSessionContext();
const { cart, cartItems, subtotal, totalPrice, shippingTotal } = useCart();
const { customerAddresses, loadCustomerAddresses } = useAddress();
const modal = inject<SharedModal>("modal") as SharedModal;
const isLoading = reactive<{ [key: string]: boolean }>({});

const selectedShippingMethod = computed({
  get(): string {
    return shippingMethod.value?.id || "";
  },
  async set(shippingMethodId: string) {
    isLoading[shippingMethodId] = true;
    await setShippingMethod({ id: shippingMethodId });
    isLoading[shippingMethodId] = false;
  },
});
const selectedPaymentMethod = computed({
  get(): string {
    return paymentMethod.value?.id || "";
  },
  async set(paymentMethodId: string) {
    isLoading[paymentMethodId] = true;
    await setPaymentMethod({ id: paymentMethodId });
    isLoading[paymentMethodId] = false;
  },
});

const selectedShippingAddress = computed({
  get(): string {
    return activeShippingAddress.value?.id || "";
  },
  async set(shippingAddressId: string) {
    isLoading[`shipping-${shippingAddressId}`] = true;
    await setActiveShippingAddress({ id: shippingAddressId });
    if (shippingAddressId === selectedBillingAddress.value)
      state.customShipping = false;
    isLoading[`shipping-${shippingAddressId}`] = false;
  },
});

const selectedBillingAddress = computed({
  get(): string {
    return activeBillingAddress.value?.id || "";
  },
  async set(billingAddressId: string) {
    isLoading[`billing-${billingAddressId}`] = true;
    await setActiveBillingAddress({ id: billingAddressId });
    if (billingAddressId === selectedShippingAddress.value)
      state.customShipping = false;
    isLoading[`billing-${billingAddressId}`] = false;
  },
});

const isCartLoading = computed(() => {
  return !cart.value;
});

const isCheckoutAvailable = computed(() => {
  return cartItems.value.length > 0;
});

const isUserSession = computed(() => isLoggedIn.value || isGuestSession.value);

const state = reactive<any>({
  salutationId: "",
  firstName: "",
  fullName: "",
  lastName: "",
  email: "",
  guest: true,
  shippingAddress: {
    firstName: "",
    fullName: "",
    lastName: "",
    street: "",
    zipcode: "",
    city: "",
    countryId: "",
    phoneNumber: ""
  },
  billingAddress: {
    firstName: "",
    fullName: "",
    lastName: "",
    street: "",
    zipcode: "",
    city: "",
    countryId: "",
    phoneNumber: ""
  },
  customShipping: false,
});

const rules = computed(() => ({
  salutationId: {
    required,
  },
  firstName: {
    required,
    minLength: minLength(3),
  },
  lastName: {
    required,
    minLength: minLength(3),
  },
  email: {
    required,
    email,
  },
  // password: {
  //   required: requiredIf(() => {
  //     return !state.guest;
  //   }),
  //   minLength: minLength(8),
  // },
  billingAddress: {
    salutationId: {
      required,
    },
    street: {
      required,
      minLength: minLength(3),
    },
    zipcode: {
      required,
    },
    city: {
      required,
    },
    countryId: {
      required,
    },
  },
  shippingAddress: {
    salutationId: {
      required,
    },
    street: {
      required,
      minLength: minLength(3),
    },
    zipcode: {
      required,
    },
    city: {
      required,
    },
    countryId: {
      required,
    },
  },
}));

const $v = useVuelidate(rules, state);

onMounted(async () => {
  refreshSessionContext();

  isLoading["shippingAddress"] = true;
  isLoading["shippingMethods"] = true;
  isLoading["paymentMethods"] = true;

  Promise.any([
    isLoggedIn.value ? loadCustomerAddresses() : null,
    getShippingMethods(),
    getPaymentMethods(),
  ]).finally(() => {
    isLoading["shippingAddress"] = false;
    isLoading["shippingMethods"] = false;
    isLoading["paymentMethods"] = false;
  });
});

const registerErrors = ref<ShopwareError[]>([]);

const placeOrder = async () => {
  isLoading["placeOrder"] = true;
  const order = await createOrder();
  isLoading["placeOrder"] = false;
  return push("/checkout/success/" + order.id);
};

const invokeSubmit = async () => {
  $v.value.$touch();
  registerErrors.value = [];
  const valid = await $v.value.$validate();
  isLoading.all = true;
  if (valid) {
    try {
      await registerUser();
      await placeOrder();
    } finally {
      isLoading.all = false;
    }
  }
};

const registerUser = async () => {
  try {
    await register(state);
  } catch (error) {
    const e = error as ClientApiError;
    registerErrors.value = e.messages;
  }
}

async function invokeLogout() {
  await logout();
  await push("/");
}

watch(() => state.shippingAddress.fullName, (fullName) => {
  const [firstName, ...lastNameArr] = fullName.trim().split(' ');
  state.shippingAddress.firstName = firstName;
  state.shippingAddress.lastName = lastNameArr.join(' ');
});

watch(() => state.billingAddress.fullName, (fullName) => {
  const [firstName, ...lastNameArr] = fullName.trim().split(' ');
  state.billingAddress.firstName = firstName;
  state.billingAddress.lastName = lastNameArr.join(' ');
});

watch(() => state.fullName, (fullName) => {
  const [firstName, ...lastNameArr] = fullName.trim().split(' ');
  state.firstName = firstName;
  state.lastName = lastNameArr.join(' ');
});

watch(isSameBillingAndShipping, (value) => {
  if (value) {
    state.billingAddress = {...state.shippingAddress};
  } else {
    state.billingAddress = {
      firstName: "",
      fullName: "",
      lastName: "",
      street: "",
      zipcode: "",
      city: "",
      countryId: "",
      phoneNumber: ""
    }
  }
})

</script>

<template>
  <div class="mt-12 md:mt-16 mb-24">
    <div
      v-if="isCheckoutAvailable || isCartLoading"
      class="checkout-inner"
      :class="{
        'opacity-20': isCartLoading,
      }"
    >
      <div class="flex flex-col md:flex-row gap-16">
        <div class="flex-1">
          <form 
            class="flex flex-col gap-10"
            id="checkout-billing-address"
            name="checkout-billing-address"
            method="post"
            @submit.prevent="invokeSubmit"
          >
            <div v-if="!isUserSession">
              <button
                type="button"
                class="flex items-center justify-center px-5 py-2 text-base font-medium text-white shadow-sm bg-gray-800"
              >
                Log in to your account
              </button>
            </div>
            <span v-if="!isUserSession" class="text-base text-dark-variant">or fill the details below.</span>
            <div>
              <h6 class="text-lg font-medium text-dark-primary mb-4">Contact information</h6>
              <div class="flex flex-col gap-6">
                <div>
                  <label class="text-sm font-medium text-gray-700 mb-1" for="email-address">Email address</label>
                  <input
                    v-model="state.email"
                    id="email-address"
                    name="email"
                    type="email"
                    autocomplete="email"
                    class="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:z-10 sm:text-sm"
                  />
                </div>
                <div>
                  <label class="text-sm font-medium text-gray-700 mb-1" for="salutation">Salutation</label>
                  <select
                    id="salutation"
                    v-model="state.salutationId"
                    required
                    name="salutation"
                    autocomplete="salutation"
                    class="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:z-10 sm:text-sm"
                    data-testid="checkout-pi-country-input"
                    @blur="$v.salutationId.$touch()"
                  > 
                    <option disabled selected value="">
                      Choose salutation...
                    </option>
                    <option
                      v-for="salutation in getSalutations"
                      :key="salutation.id"
                      :value="salutation.id"
                    >
                      {{ (salutation.translated as any)?.displayName }}
                    </option>
                  </select>
                </div>
                <div>
                  <label class="text-sm font-medium text-gray-700 mb-1" for="fullname">Full name</label>
                  <input
                    v-model="state.fullName"
                    id="fullname"
                    name="fullname"
                    type="text"
                    autocomplete="fullname"
                    class="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:z-10 sm:text-sm"
                  />
                </div>
              </div>
            </div>
            <div class="border-b border-gray-200"></div>
            <div>
              <h6 class="text-lg font-medium text-dark-primary mb-4">Shipping information</h6>
              <div class="flex flex-col gap-6">
                <div>
                  <label class="text-sm font-medium text-gray-700 mb-1" for="shipping-salutation">Salutation</label>
                  <select
                    id="shipping-salutation"
                    v-model="state.shippingAddress.salutationId"
                    required
                    name="shipping-salutation"
                    autocomplete="shipping-salutation"
                    class="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:z-10 sm:text-sm"
                    data-testid="checkout-pi-country-input"
                    @blur="$v.shippingAddress.salutationId.$touch()"
                  > 
                    <option disabled selected value="">
                      Choose salutation...
                    </option>
                    <option
                      v-for="salutation in getSalutations"
                      :key="salutation.id"
                      :value="salutation.id"
                    >
                      {{ (salutation.translated as any)?.displayName }}
                    </option>
                  </select>
                </div>
                <div>
                  <label class="text-sm font-medium text-gray-700 mb-1" for="shipping-fullname">Full name</label>
                  <input
                    v-model="state.shippingAddress.fullName"
                    id="shipping-fullname"
                    name="shipping-fullname"
                    type="text"
                    autocomplete="shipping-fullname"
                    class="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:z-10 sm:text-sm"
                  />
                </div>
                <div>
                  <label class="text-sm font-medium text-gray-700 mb-1" for="address">Address</label>
                  <input
                    v-model="state.shippingAddress.street"
                    id="address"
                    name="address"
                    type="text"
                    autocomplete="address"
                    class="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:z-10 sm:text-sm"
                  />
                </div>
                <div class="flex gap-4">
                  <div class="w-1/3">
                    <label class="text-sm font-medium text-gray-700 mb-1" for="zipcode">Zip-code</label>
                    <input
                      v-model="state.shippingAddress.zipcode"
                      id="zipcode"
                      name="zipcode"
                      type="text"
                      autocomplete="zipcode"
                      class="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:z-10 sm:text-sm"
                    />
                  </div>
                  <div class="w-1/3">
                    <label class="text-sm font-medium text-gray-700 mb-1" for="city">City</label>
                    <input
                      v-model="state.shippingAddress.city"
                      id="city"
                      name="city"
                      type="text"
                      autocomplete="city"
                      class="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:z-10 sm:text-sm"
                    />
                  </div>
                  <div class="w-1/3">
                    <label class="text-sm font-medium text-gray-700 mb-1" for="city">Country</label>
                    <select
                      id="country"
                      v-model="state.shippingAddress.countryId"
                      required
                      name="country"
                      autocomplete="country-name"
                      class="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:z-10 sm:text-sm"
                      data-testid="checkout-pi-country-input"
                      @blur="$v.shippingAddress.countryId.$touch()"
                    > 
                      <option disabled selected value="">
                        Choose country...
                      </option>
                      <option
                        v-for="country in getCountries"
                        :key="country.id"
                        :value="country.id"
                      >
                        {{ country.translated.name }}
                      </option>
                    </select>
                  </div>
                </div>
                <div>
                  <label class="text-sm font-medium text-gray-700 mb-1" for="phone">Phone number (Optional)</label>
                  <input
                    v-model="state.shippingAddress.phoneNumber"
                    id="phone"
                    name="phone"
                    autocomplete="phone"
                    class="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:z-10 sm:text-sm"
                  />
                </div>
                <SharedCheckbox 
                  :content="'Use same for billing  information'"
                  v-model="isSameBillingAndShipping"
                />
              </div>
            </div>
            <div class="border-b border-gray-200"></div>
            <template v-if="!isSameBillingAndShipping">
              <div>
                <h6 class="text-lg font-medium text-dark-primary mb-4">Billing information</h6>
                <div class="flex flex-col gap-6">
                  <div>
                    <label class="text-sm font-medium text-gray-700 mb-1" for="billing-salutation">Salutation</label>
                    <select
                      id="billing-salutation"
                      v-model="state.billingAddress.salutationId"
                      required
                      name="billing-salutation"
                      autocomplete="billing-salutation"
                      class="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:z-10 sm:text-sm"
                      data-testid="checkout-pi-country-input"
                      @blur="$v.billingAddress.salutationId.$touch()"
                    > 
                      <option disabled selected value="">
                        Choose salutation...
                      </option>
                      <option
                        v-for="salutation in getSalutations"
                        :key="salutation.id"
                        :value="salutation.id"
                      >
                        {{ (salutation.translated as any)?.displayName }}
                      </option>
                    </select>
                  </div>
                  <div>
                    <label class="text-sm font-medium text-gray-700 mb-1" for="billing-fullname">Full name</label>
                    <input
                      v-model="state.billingAddress.fullName"
                      id="billing-fullname"
                      name="billing-fullname"
                      type="text"
                      autocomplete="billing-fullname"
                      class="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:z-10 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label class="text-sm font-medium text-gray-700 mb-1" for="address">Address</label>
                    <input
                      v-model="state.billingAddress.street"
                      id="address"
                      name="address"
                      type="text"
                      autocomplete="address"
                      class="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:z-10 sm:text-sm"
                    />
                  </div>
                  <div class="flex gap-4">
                    <div class="w-1/3">
                      <label class="text-sm font-medium text-gray-700 mb-1" for="zipcode">Zip-code</label>
                      <input
                        v-model="state.billingAddress.zipcode"
                        id="zipcode"
                        name="zipcode"
                        type="text"
                        autocomplete="zipcode"
                        class="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:z-10 sm:text-sm"
                      />
                    </div>
                    <div class="w-1/3">
                      <label class="text-sm font-medium text-gray-700 mb-1" for="city">City</label>
                      <input
                        v-model="state.billingAddress.city"
                        id="city"
                        name="city"
                        type="text"
                        autocomplete="city"
                        class="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:z-10 sm:text-sm"
                      />
                    </div>
                    <div class="w-1/3">
                      <label class="text-sm font-medium text-gray-700 mb-1" for="city">Country</label>
                      <select
                        id="country"
                        v-model="state.billingAddress.countryId"
                        required
                        name="country"
                        autocomplete="country-name"
                        class="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:z-10 sm:text-sm"
                        data-testid="checkout-pi-country-input"
                        @blur="$v.billingAddress.countryId.$touch()"
                      > 
                        <option disabled selected value="">
                          Choose country...
                        </option>
                        <option
                          v-for="country in getCountries"
                          :key="country.id"
                          :value="country.id"
                        >
                          {{ country.translated.name }}
                        </option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label class="text-sm font-medium text-gray-700 mb-1" for="phone">Phone number (Optional)</label>
                    <input
                      v-model="state.shippingAddress.phoneNumber"
                      id="phone"
                      name="phone"
                      autocomplete="phone"
                      class="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:z-10 sm:text-sm"
                    />
                  </div>
                </div>
              </div>
              <div class="border-b border-gray-200"></div>
            </template>
            <div>
              <h6 class="text-lg font-medium text-dark-primary mb-4">Delivery method</h6>
              <ul class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <li
                  v-for="singleShippingMethod in shippingMethods"
                  :key="singleShippingMethod.id"
                  class="shadow-sm relative"
                  :class="selectedShippingMethod === singleShippingMethod.id ? 'border-2 border-gray-500' : 'border border-gray-300'"
                >
                  <input
                    :id="singleShippingMethod.id"
                    v-model="selectedShippingMethod"
                    :value="singleShippingMethod.id"
                    name="shipping-method"
                    type="radio"
                    class="focus:ring-brand-primary h-4 w-4 border-gray-300 hidden"
                    :data-testid="`checkout-shipping-method-${singleShippingMethod.id}`"
                  />
                  <label
                    :for="singleShippingMethod.id"
                    :class="{ 'animate-pulse': isLoading[singleShippingMethod.id] }"
                    class="p-4 block text-sm font-medium text-gray-900 cursor-pointer"
                  >
                    <p>{{ (singleShippingMethod as any).translated.name }}</p>
                    <p class="text-sm text-gray-500">
                      {{(singleShippingMethod.deliveryTime as any)?.translated?.name}}
                    </p>
                    <br/>
                    <p class="font-medium text-sm">{{currency?.symbol}}{{ (singleShippingMethod.prices?.[0] as any)?.currencyPrice?.[0].gross  }}</p>
                  </label>
                  <CheckCircleIcon v-if="selectedShippingMethod === singleShippingMethod.id" class="text-gray-600 absolute top-4 right-4 h-5 w-5" />
                </li>
              </ul>
            </div>
            <div class="border-b border-gray-200"></div>
            <div>
              <h6 class="text-lg font-medium text-dark-primary mb-4">Payment</h6>
              <div v-if="isLoading['paymentMethods']" class="w-60 h-24">
                <div class="flex animate-pulse flex-row items-top pt-4 h-full space-x-5">
                  <div class="w-4 bg-gray-300 h-4 rounded-full" />
                  <div class="flex flex-col space-y-3">
                    <div class="w-36 bg-gray-300 h-6 rounded-md" />
                    <div class="w-24 bg-gray-300 h-6 rounded-md" />
                  </div>
                </div>
              </div>
              <form v-else>
                <RadioGroup
                  v-model="selectedPaymentMethod"
                  class="border border-gray-200"
                >
                  <RadioGroupOption
                    v-for="paymentMethod in paymentMethods"
                    :key="paymentMethod.id"
                    :value="paymentMethod.id"
                    v-slot="{ checked }"
                  >
                    <div
                      :class="[checked ? 'bg-gray-50 text-white' : 'bg-white ']"
                      class="relative flex cursor-pointer rounded-lg p-4"
                    >
                      <div>
                        <span
                          :class="[
                          checked
                            ? 'bg-gray-800 border-transparent'
                            : 'bg-white border-gray-300',
                          ' h-4 w-4 mr-3 mt-0.25 rounded-full border flex items-center justify-center',
                        ]"
                          aria-hidden="true"
                        >
                        <span class="rounded-full bg-white w-1.5 h-1.5" />
                      </span>
                      </div>
                      <div>
                        <RadioGroupLabel class="block cursor-pointer">
                          <h6 class="block text-sm font-medium text-gray-900">{{ paymentMethod.translated?.name }}</h6>
                          <p class="text-gray-700 text-sm">
                            {{ paymentMethod.translated?.description }}
                          </p>
                        </RadioGroupLabel>
                      </div>
                    </div>

                    <div class="w-full border-b border-b-gray-200" />
                  </RadioGroupOption>
                </RadioGroup>
              </form>
            </div>
            <div class="border-b border-gray-200"></div>
            <div class="w-full block md:hidden">
              <h5 class="text-lg font-medium text-dark-primary mb-4">Order summary</h5>
              <SharedOrdersSummary :showCartItems="true"/>
            </div>
            <button
              class="flex items-center justify-center px-5 py-3 text-base font-medium text-white shadow-sm bg-gray-800 disabled:opacity-70"
              type="submit"
              :disabled="isLoading.all"
            >
              Confirm order
            </button>
            <div class="md:max-w-[344px]">
              <SharedValueProposition :isColumn="true" />
            </div>
          </form>
        </div>
        <div class="w-full hidden md:block md:w-1/2 md:max-w-[574px]">
          <h5 class="text-lg font-medium text-dark-primary mb-4">Order summary</h5>
          <SharedOrdersSummary :showCartItems="true"/>
        </div>
      </div>
    </div>
    <div v-else class="text-center">
      <h1 class="m-10 text-2xl font-medium text-gray-900">
        Your cart is empty!
      </h1>
      <NuxtLink
        class="inline-flex justify-center py-2 px-4 my-8 border border-transparent text-sm font-medium rounded-md text-white bg-brand-primary hover:bg-brand-dark focus:outline-none focus:ring-2 focus:ring-brand-light"
        to="/"
        data-testid="checkout-go-home-link"
      >
        Go to home page
      </NuxtLink>
    </div>
  </div>
</template>
